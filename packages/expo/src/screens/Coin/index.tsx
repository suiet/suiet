import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ColorValue,
  ViewProps,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from 'react-native';
import { Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import {
  SvgPlus,
  SvgArrowDown,
  SvgArrowUp,
  SvgSwitchHorizontal01,
  SvgCopy,
  SvgChevronDown,
  SvgChevronRight,
  SvgClose,
  SvgCopyDotted,
  SvgQRCode,
} from '@components/icons/constants';
import {
  Gray_50,
  Gray_100,
  Gray_200,
  Gray_400,
  Gray_500,
  Gray_600,
  Gray_700,
  Gray_900,
  Secondary_50,
  Primary_50,
} from '@styles/colors';
import CoinIcon from '@components/CoinIcon';
import ButtonWithIcon from '@components/ButtonWithIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Send: React.FC = () => {
  return (
    <>
      <ListItem
        backgroundColor={Primary_50}
        textColor={Gray_500}
        symbol={'SUI'}
        balance={'1234.56'}
        style={{ marginBottom: 24 }}
      />
      <View style={{ marginLeft: 8, marginRight: 8, marginBottom: 24 }}>
        <Text style={{ fontWeight: '700', fontSize: 24, lineHeight: 36, color: '#000000' }}>Input Address</Text>
        <Text style={{ fontWeight: '600', fontSize: 16, lineHeight: 20, color: Gray_400 }}>
          Enter and validate Address
        </Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
        <ButtonWithIcon title="Paste" iconSvg={SvgCopyDotted} style={{ marginRight: 8 }} />
        <ButtonWithIcon title="Scan QR Code" iconSvg={SvgQRCode} style={{}} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <TextInput
          multiline
          editable
          numberOfLines={4}
          maxLength={40}
          style={{
            padding: 10,
            paddingLeft: 14,
            paddingRight: 14,
            borderWidth: 1,
            borderColor: Gray_200,
            borderRadius: 16,

            fontFamily: Platform.select({
              ios: 'Menlo',
              android: 'monospace',
            }),
            fontWeight: '400',
            fontSize: 16,
            lineHeight: 24,

            ...Platform.select({
              ios: {
                minHeight: 100,
              },
            }),
          }}
          placeholder="Enter SUI Address"
          placeholderTextColor={Gray_500}
          textAlignVertical="top"
        />
      </View>

      {/* <View style={{ height: 450, backgroundColor: 'red' }} /> */}
    </>
  );
};

const ListItem: React.FC<
  { backgroundColor: ColorValue; textColor: ColorValue; symbol: string; balance: string } & ViewProps
> = ({ backgroundColor, textColor, symbol, balance, style, ...props }) => {
  return (
    <View
      style={[
        {
          height: 72,
          borderRadius: 16,
          backgroundColor,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginTop: 6,
          marginBottom: 6,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ marginRight: 12 }}>
        <CoinIcon symbol={symbol} />
      </View>
      <Text
        style={{
          flexGrow: 1,
          flexShrink: 0,
          fontWeight: '600',
          fontSize: 19,
          lineHeight: 19,
          color: textColor,
        }}
      >
        {symbol}
      </Text>
      <Text
        style={{
          flexGrow: 0,
          flexShrink: 0,
          fontWeight: '600',
          fontSize: 19,
          lineHeight: 19,
          color: textColor,
        }}
      >
        {balance}
      </Text>
    </View>
  );
};

const CoinAction: React.FC<{ text: string; iconSvg: string }> = ({ text, iconSvg }) => {
  const { top, bottom } = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal((modal) => !modal);

  return (
    <TouchableOpacity onPress={() => setShowModal(true)}>
      <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={text}>
        <View style={{ backgroundColor: Gray_100, borderRadius: 9999 }}>
          <SvgXml style={{ margin: 14 }} width={24} height={24} color={Gray_700} xml={iconSvg} />
        </View>
        <Text style={{ color: Gray_500, fontSize: 12, lineHeight: 24 }}>{text}</Text>
      </View>

      <Modal
        swipeDirection={'down'}
        onSwipeComplete={toggleShowModal}
        onBackdropPress={toggleShowModal}
        onBackButtonPress={toggleShowModal}
        propagateSwipe={true}
        isVisible={showModal}
        avoidKeyboard
        /**
         * @see https://github.com/react-native-modal/react-native-modal/issues/268#issuecomment-493464419
         */
        backdropTransitionOutTiming={0}
      >
        <View style={{ flexGrow: 1 }}></View>
        <View
          style={{
            marginTop: top,
            marginLeft: -21,
            marginRight: -21,
            marginBottom: -21, // hack

            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,

            backgroundColor: '#FFF',
          }}
        >
          <View style={{ position: 'absolute', width: '100%', height: 68, left: 0, top: 0 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: Gray_100,
                    marginTop: 8,
                    marginBottom: 8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              </View>
              <SvgXml style={{ margin: 24, opacity: 0 }} width={20} height={20} color={Gray_700} xml={SvgClose} />
              <Text
                style={{
                  flexGrow: 1,
                  fontWeight: '600',
                  fontSize: 18,
                  lineHeight: 28,
                  color: Gray_700,
                  textAlign: 'center',

                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                {text}
              </Text>
              <TouchableOpacity onPress={toggleShowModal}>
                <SvgXml style={{ margin: 24 }} width={20} height={20} color={Gray_700} xml={SvgClose} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ marginTop: 68, paddingLeft: 24, paddingRight: 24 }}>
            <Send />

            <View style={{ height: bottom }} />
          </ScrollView>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const Coin: React.FC = ({}) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top }}>
      <ScrollView style={{ paddingTop: 24, paddingLeft: 24, paddingRight: 24 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home2')}>
          <Image style={{ width: 64, height: 64 }} source={require('../../../assets/Avatar.png')} />
        </TouchableOpacity>

        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <Text style={{ fontWeight: '700', fontSize: 32, lineHeight: 38, color: Gray_900 }}>Suiet</Text>
          <View style={{ backgroundColor: Gray_100, borderRadius: 9999, margin: 8 }}>
            <SvgXml style={{ margin: 4 }} width={16} height={16} color={Gray_700} xml={SvgChevronDown} />
          </View>
        </View>

        <View>
          <View
            style={{
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#EFF1F5',
              borderRadius: 9999,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <Text
              style={{
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 18,
                fontFamily: Platform.select({
                  ios: 'Menlo',
                  android: 'monospace',
                }),
                color: Gray_700,
              }}
            >
              0x2152f....01f6
            </Text>
            <SvgXml style={{ margin: 4 }} width={12} height={12} color={Gray_700} xml={SvgCopy}></SvgXml>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16, marginBottom: 16 }}>
          {[
            {
              svg: SvgPlus,
              text: 'Buy',
            },
            {
              svg: SvgArrowDown,
              text: 'Receive',
            },
            {
              svg: SvgArrowUp,
              text: 'Send',
            },
            {
              svg: SvgSwitchHorizontal01,
              text: 'Swap',
            },
          ].map(({ svg, text }, index) => (
            <CoinAction key={text} text={text} iconSvg={svg} />
          ))}
        </View>

        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flexGrow: 1, fontWeight: '700', fontSize: 16, lineHeight: 20, color: Gray_900 }}>
              Tokens
            </Text>
            <Text style={{ color: Gray_400 }}>See all</Text>
            <SvgXml style={{ margin: 2 }} width={16} height={16} color={Gray_700} xml={SvgChevronRight}></SvgXml>
          </View>
          {['SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token'].map(
            (item, i) => {
              const backgroundColor = Secondary_50;
              const textColor = Gray_900;
              return (
                <ListItem
                  key={i}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  symbol={item}
                  balance={'1234.56'}
                />
              );
            }
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Coin;
