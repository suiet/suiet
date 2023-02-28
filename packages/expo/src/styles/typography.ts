import { useFonts as useInterFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts as useWorkSansFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';

function useFonts() {
  const [fontsInterLoaded] = useInterFonts({
    Inter_700Bold,
  });

  const [fontsWorkSansLoaded] = useWorkSansFonts({
    WorkSans_700Bold,
  });

  return fontsInterLoaded && fontsWorkSansLoaded;
}

export const WorkSans_700_16 = {
  fontFamily: 'WorkSans_700',
  fontWeight: '700',
  fontSize: 16,
  // lineHeight: 20,
};

export const WorkSans_700_32 = {
  fontFamily: 'WorkSans_700',
  fontWeight: '700',
  fontSize: 32,
  // lineHeight: 38,
};

export const Inter_700_16 = {};
