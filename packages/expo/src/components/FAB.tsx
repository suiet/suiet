import { FontFamilys } from '@/hooks/useFonts';
import {
  Gray_100,
  Gray_200,
  Gray_300,
  Gray_500,
  Gray_700,
  Gray_900,
  Primary_400,
  Primary_500,
  Primary_600,
} from '@/styles/colors';
import * as React from 'react';
import { View } from 'react-native';
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
  useAnimatedProps,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

const AnimatedSvgXml = Animated.createAnimatedComponent(
  class extends React.Component<{ color?: string; svg: string }, {}> {
    render() {
      const { svg, color } = this.props;
      return <SvgXml style={{ margin: 14 }} xml={svg} width={24} height={24} color={color} />;
    }
  }
);

export const FAB: React.FC<
  TouchableNativeFeedbackProps & {
    svg: string;
  }
> = ({ onPress, disabled, svg }) => {
  const colors = {
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
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [disabled ? colors.backgroundColorDisabled : colors.backgroundColor, colors.backgroundColorPressed],
      'RGB',
      {}
    );
    return {
      backgroundColor,
    };
  });

  const animatedProps = useAnimatedProps(() => {
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
      <Animated.View style={[{ backgroundColor: Gray_100, borderRadius: 9999 }, animatedStyle]}>
        <AnimatedSvgXml animatedProps={animatedProps} svg={svg} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
