import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner, PermissionStatus, BarCodeScannedCallback } from 'expo-barcode-scanner';
import type { RootStackParamList } from '@/../App';
import { StackScreenProps } from '@react-navigation/stack';
import { EventEmitter } from 'eventemitter3';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { SvgClose } from '@/components/icons/constants';
import { Gray_700 } from '@/styles/colors';

export const ScanQRCode: React.FC<StackScreenProps<RootStackParamList, 'ScanQRCode'>> = ({ route, navigation }) => {
  const source = Image.resolveAssetSource(require('@assets/bg.png'));
  const { width, height } = Dimensions.get('screen');

  const { bottom } = useSafeAreaInsets();

  const [hasPermission, setHasPermission] = useState<boolean>();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    async function requestPermission() {
      const { getPermissionsAsync, requestPermissionsAsync } = await import('expo-barcode-scanner');
      if (!(await getPermissionsAsync()).granted) {
        if (!(await requestPermissionsAsync()).granted) {
          Alert.alert('Error', "Can't get camera permission. Please try again.");
          return;
        }
      }

      setHasPermission(true);
    }

    requestPermission();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    setScanned(true);
    ee.emit('qrCodeScanned', data);
    navigation.goBack();
  };

  if (hasPermission === undefined) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar style="light" />
      {/* <Image style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="stretch" source={source} /> */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 24,
          paddingBottom: bottom + 24,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View
            style={{
              borderRadius: 9999,
              backgroundColor: 'white',
              width: 64,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SvgXml width={48} height={48} xml={SvgClose} color={Gray_700} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ee = new EventEmitter<'qrCodeScanned'>();
