import { useEffect, useState } from 'react';
import { loadAsync } from 'expo-font';

export type FontFamily = Exclude<
  | keyof typeof import('@expo-google-fonts/inter')
  | keyof typeof import('@expo-google-fonts/work-sans')
  | keyof typeof import('@expo-google-fonts/roboto-mono'),
  'useFonts' | '__metadata__'
>;

import { Inter_700Bold, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';
import { WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';

const MAP = {
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
  WorkSans_700Bold,
  RobotoMono_400Regular,
};

export function useFonts() {
  let [loaded, setLoaded] = useState(false);
  let [error, setError] = useState(null);

  useEffect(() => {
    loadAsync(MAP)
      .then(() => setLoaded(true))
      .catch(setError);
  }, []);

  return [loaded, error];
}

export const FontFamilys = Object.fromEntries(Object.keys(MAP).map((a) => [a, a])) as Record<
  keyof typeof MAP,
  'string'
>;
