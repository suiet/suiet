import { Text, View, Platform, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { SvgArrowLeft, SvgClose } from '@components/icons/constants';
import { Gray_100, Gray_400, Gray_700 } from '@styles/colors';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Header: React.FC<{ onLeftAction?: () => void; onRightAction?: () => void; title: string }> = ({
  onLeftAction,
  onRightAction,
  title,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: Platform.select({
          ios: 0,
          android: top,
          default: 0,
        }),
        height:
          68 +
          Platform.select({
            ios: 0,
            android: top,
            default: 0,
          }),
        left: 0,
        top: 0,
        backgroundColor: '#fff',
      }}
    >
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

        <View style={{ width: 68, height: 68 }}>
          {onLeftAction && (
            <TouchableOpacity onPress={onLeftAction}>
              <SvgXml style={{ margin: 24 }} width={20} height={20} color={Gray_400} xml={SvgArrowLeft} />
            </TouchableOpacity>
          )}
        </View>
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
          {title}
        </Text>
        <View style={{ width: 68, height: 68 }}>
          {onRightAction && (
            <TouchableOpacity onPress={onRightAction}>
              <SvgXml style={{ margin: 24 }} width={20} height={20} color={Gray_400} xml={SvgClose} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
