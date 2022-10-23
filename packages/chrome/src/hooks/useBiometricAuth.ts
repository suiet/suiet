import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bufferDecode, bufferEncode } from '../utils/biometricAuth/buffer';
import { useApiClient } from './useApiClient';
import {
  updateAuthed,
  updateBiometricDismissed,
  updateBiometricSetuped,
} from '../store/app-context';
import { extractInfoFromCredential } from '../utils/biometricAuth';
import type { AppDispatch, RootState } from '../store';
import message from '../components/message';

const SUIET_WALLET_BYTES = Uint8Array.from('Suiet Wallet', (c) =>
  c.charCodeAt(0)
);

const CREDENTIAL_CREATION_OPTIONS = {
  publicKey: {
    challenge: SUIET_WALLET_BYTES,
    rp: {
      name: 'Suiet Wallet',
      icon: 'https://assets.suiet.app/Logo.png',
    },
    user: {
      name: 'Suiet Wallet',
      displayName: 'Suiet Wallet',
      id: SUIET_WALLET_BYTES,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      // { type: 'public-key', alg: -35 },
      // { type: 'public-key', alg: -36 },
      // { type: 'public-key', alg: -257 },
      // { type: 'public-key', alg: -258 },
      // { type: 'public-key', alg: -259 },
      // { type: 'public-key', alg: -37 },
      // { type: 'public-key', alg: -38 },
      // { type: 'public-key', alg: -39 },
      // { type: 'public-key', alg: -8 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    timeout: 60000,
  },
} as any;

export function useBiometricAuth() {
  const apiClient = useApiClient();
  const dispatch = useDispatch<AppDispatch>();

  const isSupported =
    // currently only support mac, because design is not ready for other platforms,
    // and we use "Touch ID" as feature name
    navigator.credentials && navigator.platform.toUpperCase().includes('MAC');
  const isSetuped = useSelector(
    (state: RootState) => state.appContext.biometricSetuped
  );
  const isDismissed = useSelector(
    (state: RootState) => state.appContext.biometricDismissed
  );

  useEffect(() => {
    (async function () {
      if (isSetuped === undefined) {
        const hasBiometricData = await apiClient.callFunc<null, any>(
          'auth.hasBiometricData',
          null
        );
        dispatch(updateBiometricSetuped(hasBiometricData));
      }
    })();
  }, []);

  const dismiss = () => {
    dispatch(updateBiometricDismissed(true));
  };

  const setup = async () => {
    const clientId = await apiClient.callFunc<null, string>(
      'auth.getClientId',
      null
    );

    const credential = await navigator.credentials.create(
      CREDENTIAL_CREATION_OPTIONS
    );

    if (credential) {
      const { credentialIdBase64, publicKeyBase64 } =
        extractInfoFromCredential(credential);

      const authKey = await apiClient.callFunc<any, string>(
        'auth.setBiometricData',
        {
          credentialIdBase64,
          publicKeyBase64,
        }
      );

      try {
        const resp = await fetch(
          `https://api.suiet.app/extension/auth/set-auth-key`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              client_id: clientId,
              auth_key: authKey,
              public_key_base64: publicKeyBase64,
            }),
          }
        );

        if (resp.ok) {
          dispatch(updateBiometricSetuped(true));
          message.success('Setup Touch ID successfully!');
          return;
        }
      } catch (e) {}

      // Encountered a `set-auth-key` api error while setup biometric auth
      // We must remove the biometric data, otherwise the user will be locked out
      // of the biometric auth.
      // This MUST result a unsuccesful setup
      await apiClient.callFunc<null, null>('auth.resetBiometricData', null);
      message.error('Failed to setup Touch ID, please try again.', {
        // Longer duration for long error message
        autoClose: 3000,
      });
    }
  };

  const authenticate = async () => {
    const clientId = await apiClient.callFunc<null, string>(
      'auth.getClientId',
      null
    );

    if (isSetuped !== true) {
      return false;
    }

    const data = await apiClient.callFunc<null, any>(
      'auth.getBiometricData',
      null
    );
    const { credentialIdBase64, publicKeyBase64 } = data;
    const challenge = JSON.stringify({
      message: 'Suiet Wallet',
      datetime: new Date().toISOString(),
      nonce: ~~(Math.random() * 2 ** 30),
    });
    const challengeBase64 = btoa(challenge);
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
        allowCredentials: [
          {
            type: 'public-key',
            id: bufferDecode(credentialIdBase64),
          },
        ],
        userVerification: 'required',
        timeout: 2e4,
      },
    });

    if (assertion) {
      // @ts-expect-error
      const sig = assertion.response.signature;

      try {
        const resp = await fetch(
          `https://api.suiet.app/extension/auth/get-auth-key`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              client_id: clientId,
              message_base64: challengeBase64,
              signature_base64: bufferEncode(sig),
            }),
          }
        );

        if (resp.ok) {
          const { auth_key: authKey } = await resp.json();
          if (authKey) {
            const newAuthKey = await apiClient.callFunc<string, string>(
              'auth.unlockWithAuthKey',
              authKey
            );

            if (newAuthKey) {
              await fetch(`https://api.suiet.app/extension/auth/set-auth-key`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  client_id: clientId,
                  auth_key: newAuthKey,
                  public_key_base64: publicKeyBase64,
                }),
              });
              // if setAuth request failed, won't set context state
              dispatch(updateAuthed(true));
              return true;
            }
          }
        }
      } catch (e) {}
    }

    // unhandled case will be treated as failed auth
    message.error(
      'Touch ID authentication failed! Please UNLOCK WITH PASSWORD, and disable & re-enable Touch ID.',
      {
        style: { width: '300px' },
        // Longer duration for long error message
        autoClose: 6000,
      }
    );
    return false;
  };

  const reset = async () => {
    await apiClient.callFunc<null, null>('auth.resetBiometricData', null);
    dispatch(updateBiometricSetuped(false));
    dispatch(updateBiometricDismissed(false));
    message.success('Disable Touch ID successfully!');
  };

  return {
    isSupported,
    isDismissed,
    isSetuped,
    dismiss,
    setup,
    authenticate,
    reset,
  };
}
