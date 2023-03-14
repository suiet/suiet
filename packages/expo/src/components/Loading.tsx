import * as React from 'react';
import { useEffect } from 'react';
import { Dimensions, Text, View, Image, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
  useDerivedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

interface Props {
  animationValue: Animated.SharedValue<number>;
  label: any;
}

const Avatar: React.FC<Props> = (props) => {
  const { animationValue, label } = props;

  const translateY = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.3, 1, 0.3], Extrapolate.CLAMP);

    return {
      opacity,
    };
  }, [animationValue]);

  const labelStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-1, 0, 1], [2 / 3, 1, 2 / 3], Extrapolate.CLAMP);

    return {
      transform: [{ scale }, { translateY: translateY.value }],
    };
  }, [animationValue, translateY]);

  return (
    <Animated.View
      style={[
        {
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
      ]}
    >
      <Animated.View style={labelStyle}>
        <Image source={label} style={{ width: 48, height: 48 }} resizeMethod="scale" resizeMode="contain" />
      </Animated.View>
    </Animated.View>
  );
};

export function LoadingAvatars() {
  const width = Dimensions.get('window').width;
  return (
    <Carousel
      loop
      width={48}
      height={48}
      style={{
        width: 124,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      autoPlay
      data={[
        require('@assets/avatars/ShavedIce.png'),
        require('@assets/avatars/IceCream.png'),
        require('@assets/avatars/Cookie.png'),
        require('@assets/avatars/Croissant.png'),
        require('@assets/avatars/CookedRice.png'),
        require('@assets/avatars/SteamingBowl.png'),
        require('@assets/avatars/Bagel.png'),
        require('@assets/avatars/ChocolateBar.png'),
        require('@assets/avatars/Flatbread.png'),
      ]}
      enabled={false}
      autoPlayInterval={400}
      scrollAnimationDuration={300}
      renderItem={({ index, item, animationValue }) => <Avatar animationValue={animationValue} label={item} />}
    />
  );
}

export function LoadingDots() {
  const progress = useSharedValue(0);
  useEffect(() => {
    const pulse = withTiming(1, { duration: 2000, easing: Easing.linear });
    progress.value = withRepeat(pulse, -1, false);
  }, []);

  const color = useDerivedValue(() =>
    interpolateColor(progress.value, [0, 0.5, 0.75, 1], ['#FFA66A', '#FFA8E7', '#6CBFFF', '#FFA66A'])
  );

  const opacity1 = useDerivedValue(() =>
    interpolate(progress.value, [0, 0.25, 0.5, 0.75, 1], [0.3, 0.5, 0.7, 0.5, 0.3])
  );
  const opacity2 = useDerivedValue(() =>
    interpolate(progress.value, [0, 0.25, 0.5, 0.75, 1], [0.5, 0.7, 0.5, 0.3, 0.5])
  );
  const opacity3 = useDerivedValue(() =>
    interpolate(progress.value, [0, 0.25, 0.5, 0.75, 1], [0.7, 0.5, 0.3, 0.5, 0.7])
  );

  const style1 = useAnimatedStyle(() => {
    return {
      opacity: opacity1.value,
      backgroundColor: color.value,
    };
  });

  const style2 = useAnimatedStyle(() => {
    return {
      opacity: opacity2.value,
      backgroundColor: color.value,
    };
  });

  const style3 = useAnimatedStyle(() => {
    return {
      opacity: opacity3.value,
      backgroundColor: color.value,
    };
  });

  return (
    <View style={{ flexDirection: 'row' }}>
      {[style1, style2, style3].map((style, index) => (
        <Animated.View
          key={index}
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: '#000',
              marginHorizontal: 4,
            },
            style,
          ]}
        />
      ))}
    </View>
  );
}
