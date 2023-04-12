import { Alert, Platform } from 'react-native';

import {
  setGenericPassword,
  ACCESS_CONTROL,
  AUTHENTICATION_TYPE,
  ACCESSIBLE,
  STORAGE_TYPE,
  SECURITY_LEVEL,
  getGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';

export function useRealKeychain() {
  const isSupported = async () => {
    const { getSupportedBiometryType } = await import('react-native-keychain');
    const supportedType = await getSupportedBiometryType();
    if (supportedType === null) {
      return false;
    } else {
      return true;
    }
  };

  const alertUnsupportedDevice = async () => {
    Alert.alert(
      'Unsupported Device',
      'Unable to find a supported secure authentication method on this device. Due to security concerns, we cannot proceed.'
    );
  };

  const saveMnemonic = async (address: string, mnemonic: string) => {
    const service = `SUIET_WALLET_MNEMONIC_${address}`;

    let errorMessage: string;
    try {
      await setGenericPassword(address, mnemonic, {
        service,

        accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        storage: STORAGE_TYPE.KC,
        securityLevel: SECURITY_LEVEL.SECURE_HARDWARE,
      });

      try {
        await new Promise<void>((resolve, reject) => {
          Alert.alert(
            'Authenticate to continue',
            "A accessing test is required to ensure your device's authentication is working properly",
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  reject(new Error('Canncelled'));
                },
              },
              {
                text: 'OK',
                isPreferred: true,
                onPress: async () => {
                  resolve();
                },
              },
            ]
          );
        });

        const saved = await getGenericPassword({
          service,
          authenticationPrompt: {
            title: 'Test your device authentication',
            description: "A accessing test is required to ensure your device's authentication is working properly",
            cancel: 'Cancel',
          },
        });

        // @ts-ignore
        if (saved && saved.username === address && saved.password === mnemonic) {
          {
            // @ts-ignore
            delete saved.username;
            // @ts-ignore
            delete saved.password;
          }
          return { address, mnemonic };
        }
      } catch (e) {}
      // prettier-ignore
      errorMessage = 'Something went wrong with your device authentication. We cannot accessing your just created wallet and it will be deleted.';
    } catch (e) {
      // prettier-ignore
      errorMessage = "Failed to save your wallet to device's keychain. We cannot proceed.";
    }

    resetGenericPassword({
      service,
    });

    throw new Error(errorMessage);
  };

  const loadMnemonic = async (address: string) => {
    const service = `SUIET_WALLET_MNEMONIC_${address}`;

    try {
      const saved = await getGenericPassword({
        service,
        authenticationPrompt: {
          title: 'Authenticate to access your wallet',
          description: 'We need to access your wallet to continue',
          cancel: 'Cancel',
        },
      });

      // @ts-ignore
      if (saved && saved.username === address) {
        // @ts-ignore
        return saved.password;
      }
    } catch (e) {}

    throw new Error('Failed to load your wallet from device');
  };

  const wrapWithAlert =
    (fn: any) =>
    (...args: any[]) => {
      return new Promise((resolve, reject) => {
        Alert.alert('Authenticate to access your wallet', 'We need to access your wallet to continue', [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              reject(new Error('Canncelled'));
            },
          },
          {
            text: 'OK',
            isPreferred: true,
            onPress: async () => {
              fn(...args)
                .then(resolve)
                .catch(reject);
            },
          },
        ]);
      });
    };

  return {
    isSupported,
    alertUnsupportedDevice,

    saveMnemonic,
    loadMnemonic: Platform.select({
      ios: wrapWithAlert(loadMnemonic) as typeof loadMnemonic,
      android: loadMnemonic,
      default: loadMnemonic,
    }),
  };
}

export const useFakeKeychain: typeof useRealKeychain = () => {
  const isSupported = async () => {
    return true;
  };

  const alertUnsupportedDevice = async () => {};

  const saveMnemonic = async (address: string, mnemonic: string) => {
    return { address, mnemonic };
  };

  const loadMnemonic = async (address: string) => {
    throw new Error('not implemented');
  };

  return {
    isSupported,
    alertUnsupportedDevice,

    saveMnemonic,
    loadMnemonic,
  };
};

/**
 * Set this to true to use the fake keychain
 */
const shouldUseFakeKeychain = false;

export const useKeychain = shouldUseFakeKeychain ? useFakeKeychain : useRealKeychain;
