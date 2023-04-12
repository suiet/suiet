import { FontFamilys } from '@/hooks/useFonts';
import {
  Error_100,
  Error_50,
  Error_700,
  Gray_100,
  Gray_200,
  Gray_500,
  Gray_700,
  Gray_900,
  Primary_400,
  Primary_500,
  Primary_600,
} from '@/styles/colors';
import React from 'react';
import { TouchableWithoutFeedback, TouchableNativeFeedbackProps, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
  interpolateColor,
} from 'react-native-reanimated';

export const Button: React.FC<
  TouchableNativeFeedbackProps & {
    scaleTo?: number;
    title: string;
    innerStyle?: ViewStyle;
    textStyle?: TextStyle;
    type?: 'Primary' | 'Secondary' | 'Error';
  }
> = ({ onPress, scaleTo = 1, disabled, innerStyle, textStyle, title, type = 'Primary' }) => {
  const colors =
    type === 'Primary'
      ? {
          backgroundColor: Primary_500,
          backgroundColorPressed: Primary_600,
          backgroundColorDisabled: Gray_200,
          textColor: '#FFFFFF',
          textColorPressed: '#FFFFFF',
        }
      : type === 'Error'
      ? {
          backgroundColor: Error_50,
          backgroundColorPressed: Error_100,
          backgroundColorDisabled: Gray_200,
          textColor: Error_700,
          textColorPressed: Error_700,
        }
      : {
          backgroundColor: Gray_100,
          backgroundColorPressed: Gray_200,
          backgroundColorDisabled: Gray_200,
          textColor: Gray_700,
          textColorPressed: Gray_900,
        };

  const config = { duration: 200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };
  const pressed = useSharedValue(false);
  const progress = useDerivedValue(() => (pressed.value ? withTiming(1, config) : withTiming(0, config)));
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, scaleTo], Extrapolate.CLAMP);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [disabled ? colors.backgroundColorDisabled : colors.backgroundColor, colors.backgroundColorPressed],
      'RGB',
      {}
    );
    return {
      transform: [{ scale }],
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], [colors.textColor, colors.textColorPressed], 'RGB', {});
    return {
      color,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        pressed.value = true;
      }}
      onPressOut={() => {
        pressed.value = false;
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: 48,
            borderRadius: 9999,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
          innerStyle,
        ]}
      >
        <Animated.Text
          style={[
            { fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 16, lineHeight: 24, color: colors.textColor },
            animatedTextStyle,
            textStyle,
          ]}
        >
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
