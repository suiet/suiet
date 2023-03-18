import {
  Text,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamilys } from '@/hooks/useFonts';
import { Gray_100, Gray_200, Gray_400, Gray_500, Gray_700, Gray_900 } from '@styles/colors';

import { CoinIcon } from '@/components/CoinIcon';
import { Button } from '@/components/Button';
import type { RootStackParamList } from '@/../App';
import { SvgXml } from 'react-native-svg';
import { SvgChevronDown, SvgSwitchVertical01 } from '@/components/icons/constants';

export const TokenSelector: React.FC = () => {
  return (
    <View
      style={{
        borderRadius: 16,
        borderColor: Gray_100,
        borderWidth: 1,
        height: 36,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',

        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
    >
      <CoinIcon symbol="SUI" scale={0.5}></CoinIcon>
      <Text
        style={{ fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 14, lineHeight: 20, color: Gray_700 }}
        children="SUI"
      />
      <SvgXml width={16} height={16} color={Gray_400} xml={SvgChevronDown} />
    </View>
  );
};

const TokenAmountInput: React.FC = () => {
  const textInputRef = React.useRef<TextInput>(null);
  const [textInputValue, setTextInputValue] = React.useState<string>();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        marginBottom: 24,
      }}
    >
      <View style={{ position: 'relative', alignItems: 'center' }}>
        <Text
          style={{ fontFamily: FontFamilys.Inter_700Bold, fontSize: 36, color: Gray_200, opacity: 0 }}
          children={textInputValue || '0'}
        />

        <TextInput
          ref={textInputRef}
          value={textInputValue}
          onChangeText={setTextInputValue}
          style={[
            StyleSheet.absoluteFill,
            {
              fontFamily: FontFamilys.Inter_700Bold,
              fontSize: 36,
              color: Gray_900,
              minWidth: 100,

              backgroundColor: 'white',
            },
          ]}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={Gray_200}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          textInputRef.current?.focus();
        }}
      >
        <Text style={{ fontFamily: FontFamilys.Inter_700Bold, fontSize: 36, color: Gray_200 }} children="SUI" />
      </TouchableWithoutFeedback>
    </View>
  );
};

const Divider: React.FC = () => {
  return (
    <View style={{ position: 'relative', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',

          height: 1,
          backgroundColor: Gray_200,
        }}
      />

      <View style={{ padding: 8, borderRadius: 9999, backgroundColor: Gray_100 }}>
        <SvgXml width={16} height={16} color={Gray_500} xml={SvgSwitchVertical01} />
      </View>
    </View>
  );
};

export const Swap: React.FC<StackScreenProps<RootStackParamList, 'Swap'>> = ({ navigation }) => {
  const { width, height } = Dimensions.get('screen');
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flexGrow: 1, overflow: 'scroll', marginBottom: bottom - 8 }}
        behavior={'padding'}
        keyboardVerticalOffset={
          Platform.select({
            android: top,
            ios: top + 10,
            default: 0,
          }) + 68
        }
      >
        <ScrollView
          scrollEnabled={true}
          style={{ paddingHorizontal: 24 }}
          contentContainerStyle={{ minHeight: height }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
            <Text children="Pay" style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 16, lineHeight: 24 }} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelectToken');
              }}
            >
              <TokenSelector />
            </TouchableOpacity>
          </View>

          <TokenAmountInput />

          <Divider />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
            <Text
              children="Receive"
              style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 16, lineHeight: 24 }}
            />
            <TokenSelector />
          </View>

          <TokenAmountInput />
        </ScrollView>

        <View style={{ paddingHorizontal: 24, gap: 16, marginBottom: 24, backgroundColor: 'white' }}>
          <View style={{ height: 1, backgroundColor: Gray_100, width: '100%' }} />

          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{ fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 14, lineHeight: 20, color: Gray_900 }}
              children="Exchange Rate"
            />
            <Text
              style={{
                fontFamily: FontFamilys.RobotoMono_400Regular,
                fontSize: 14,
                lineHeight: 20,
                color: Gray_500,
                flexGrow: 1,
                textAlign: 'right',
              }}
              children="12 SUI ≈ 12 USD"
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{ fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 14, lineHeight: 20, color: Gray_900 }}
              children="Network Fee"
            />
            <Text
              style={{
                fontFamily: FontFamilys.RobotoMono_400Regular,
                fontSize: 14,
                lineHeight: 20,
                color: Gray_500,
                flexGrow: 1,
                textAlign: 'right',
              }}
              children="14.5 SUI"
            />
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: Gray_100, width }} />
        <View style={{ padding: 12 }}>
          <Button title="Confirm to swap" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
