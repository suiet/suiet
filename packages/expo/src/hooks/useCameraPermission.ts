export function useCameraPermission() {
  return {
    async ensureCameraPermission() {
      const { getPermissionsAsync, requestPermissionsAsync } = await import('expo-barcode-scanner');

      if (!(await getPermissionsAsync()).granted) {
        if (!(await requestPermissionsAsync()).granted) {
          return false;
        }
      }

      return true;
    },
  };
}
