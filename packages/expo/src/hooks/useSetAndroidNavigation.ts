import { setPositionAsync, setBackgroundColorAsync } from 'expo-navigation-bar';

import { Platform } from 'react-native';
import { useState, useEffect } from 'react';

export function useSetAndroidNavigation() {
  const [navigationSet, setNavigationSet] = useState(Platform.select({ ios: true, android: false }));
  useEffect(() => {
    if (Platform.OS === 'android') {
      (async function () {
        await setPositionAsync('absolute');
        await setBackgroundColorAsync('rgba(0, 0, 0, 0.005)');
        setNavigationSet(true);
      })();
    }
  }, []);

  return [navigationSet];
}
