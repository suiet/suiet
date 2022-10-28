import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bufferDecode, bufferEncode } from '../utils/biometricAuth/buffer';
import { useApiClient } from './useApiClient';
import { updateAuthed, updateBiometricDismissed } from '../store/app-context';
import { updateBiometricSetuped } from '../store/biometric-context';
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
    (state: RootState) => state.biometricContext.biometricSetuped
  );
  const isDismissed = useSelector(
    (state: RootState) => state.appContext.biometricDismissed
  );

  const checkEnabled = async () => {
    const biometricData = await apiClient.callFunc<null, any>(
      'auth.biometricAuthGetData',
      null
    );
    if (typeof biometricData === 'object' && biometricData !== null) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    (async function () {
      if (isSetuped === undefined) {
        dispatch(updateBiometricSetuped(await checkEnabled()));
      }
    })();
  }, []);

  const dismiss = () => {
    dispatch(updateBiometricDismissed(true));
  };

  const setup = async () => {
    if (!isSupported) {
      // throw new Error('Biometric auth is not supported');
      return false;
    }

    const credential = await navigator.credentials
      .create(CREDENTIAL_CREATION_OPTIONS)
      .catch((e) => {
        console.error(e);
      });

    if (credential) {
      const { credentialIdBase64, publicKeyBase64 } =
        extractInfoFromCredential(credential);

      try {
        const ok = await apiClient.callFunc<any, boolean>(
          'auth.biometricAuthEnable',
          {
            credentialIdBase64,
            publicKeyBase64,
          }
        );

        if (ok) {
          dispatch(updateBiometricSetuped(true));
          message.success('Setup Touch ID successfully!');
          return true;
        }
      } catch (e) {}
      return false;
    }
  };

  const authenticate = async (signal?: AbortSignal) => {
    if (!isSupported) {
      // throw new Error('Biometric auth is not supported');
      return false;
    }

    if (!isSetuped) {
      // throw new Error('Biometric auth is not setuped');
      return false;
    }

    const data = await apiClient.callFunc<null, any>(
      'auth.biometricAuthGetData',
      null
    );
    const { credentialIdBase64 } = data;
    const challenge = JSON.stringify({
      message: 'Suiet Wallet',
      datetime: new Date().toISOString(),
      nonce: ~~(Math.random() * 2 ** 30),
    });
    const challengeBase64 = btoa(challenge);
    const assertion = await navigator.credentials
      .get({
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
        signal,
      })
      .catch((e) => {
        console.error(e);
      });

    if (assertion) {
      // @ts-expect-error
      const sig = assertion.response.signature;

      try {
        const ok = await apiClient.callFunc<any, boolean>(
          'auth.biometricAuthRotateAuthKey',
          {
            challengeBase64,
            signatureBase64: bufferEncode(sig),
          }
        );

        if (ok) {
          dispatch(updateAuthed(true));
          return true;
        }
      } catch (e) {}

      if (await checkEnabled()) {
        dispatch(updateBiometricSetuped(true));
        message.error(
          'Touch ID authentication failed! Please retry or use password.',
          {
            style: { width: '270px' },
            // Longer duration for long error message
            autoClose: 6000,
          }
        );
      } else {
        dispatch(updateBiometricSetuped(false));
        dispatch(updateBiometricDismissed(false));
        message.error(
          'Touch ID authentication failed! We have disabled Touch ID for you. Please setup Touch ID again.',
          {
            style: { width: '270px' },
            // Longer duration for long error message
            autoClose: 6000,
          }
        );
      }
    }

    return false;
  };

  const reset = async (showToast: boolean = true) => {
    await apiClient.callFunc<null, null>('auth.biometricAuthDisable', null);
    dispatch(updateBiometricSetuped(false));
    dispatch(updateBiometricDismissed(false));
    if (showToast) {
      message.success('Disable Touch ID successfully!');
    }
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
