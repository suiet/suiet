import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, Dimensions } from 'react-native';
import { BarCodeScanner, PermissionStatus, BarCodeScannedCallback } from 'expo-barcode-scanner';
import { RootStackParamList } from '@/../App';
import { StackScreenProps } from '@react-navigation/stack';
import { EventEmitter } from 'eventemitter3';

export const ScanQRCode: React.FC<StackScreenProps<RootStackParamList, 'ScanQRCode'>> = ({ route, navigation }) => {
  const source = Image.resolveAssetSource(require('@assets/bg.png'));
  const { width, height } = Dimensions.get('screen');

  const [hasPermission, setHasPermission] = useState<boolean>();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    ee.emit('qrCodeScanned', data);
    navigation.goBack();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Image style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="stretch" source={source} />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

export const ee = new EventEmitter<'qrCodeScanned'>();
