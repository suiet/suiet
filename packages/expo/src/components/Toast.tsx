import { Gray_100, Gray_700, Gray_900, White_100 } from '@/styles/colors';
import { GLSL, Shaders, Node } from 'gl-react';
import { Surface } from 'gl-react-expo';
import React from 'react';
import { useEffect, useState } from 'react';
import { Image, View, StyleSheet, LayoutRectangle, ImageProps } from 'react-native';
import Typography from './Typography';

const shaders = Shaders.create({
  gradient: {
    frag: GLSL`
precision highp float;

uniform float time;
uniform vec2 resolution;

vec4 HueShift (in vec3 Color, in float Shift) {
  vec3 P = vec3(0.55735)*dot(vec3(0.55735),Color);
  vec3 U = Color-P;
  vec3 V = cross(vec3(0.55735),U);
  Color = U*cos(Shift*6.2832) + V*sin(Shift*6.2832) + P;
  return vec4(Color,1.0);
}

void main(void) {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  // st.x *= resolution.x / resolution.y;

  vec3 bg = vec3(0.);
  float v = sin(time);

  bg = vec3(st.x, st.y, 0.6);
  vec4 color = HueShift(bg, v);
  gl_FragColor = color;
}
`,
  },
});

export interface ToastProps {
  text: string;
  isVisible: boolean;
  icon?: ImageProps['source'];
  beautifulBorder?: boolean;
}

export const AngularGradientToast: React.FC<ToastProps> = ({ text, isVisible, icon, beautifulBorder = false }) => {
  const [time, setTime] = useState(0);
  const [layout, setLayout] = useState<LayoutRectangle>();

  // do 30fps interval when visible
  useEffect(() => {
    if (isVisible) {
      // FIXME: use requestAnimationFrame or do this in UI thread
      const interval = setInterval(() => {
        setTime((t) => t + 33);
      }, 33);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <View
      style={{
        padding: 1,
        backgroundColor: Gray_100,
        borderRadius: 9999,

        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowRadius: 16,
        shadowOpacity: 0.15,
        shadowColor: 'rgb(173, 175, 189)',
        elevation: 5,
      }}
      onLayout={({ nativeEvent: { layout } }) => {
        setLayout(layout);
      }}
    >
      {beautifulBorder && layout && (
        <Surface style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}>
          <Node
            shader={shaders.gradient}
            uniforms={{
              resolution: [layout.width * 4, layout.height * 4],
              time: time / 1000,
            }}
          />
        </Surface>
      )}

      <View
        style={{
          backgroundColor: White_100,
          height: '100%',
          width: '100%',
          borderRadius: 999,
          paddingVertical: 8,
          paddingLeft: 8,
          paddingRight: 16,

          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* <Image style={{ width: 20, height: 20 }} source={require('@assets/grinning_face.png')} /> */}
        {icon && <Image style={{ width: 20, height: 20 }} source={icon} />}
        <Typography.Body color={Gray_700} children={text} />
      </View>
    </View>
  );
};

// export const BasicToast: React.FC<{ text: string }> = ({ text }) => {
//   return (
//     <View
//       style={{
//         height: 36,
//         borderRadius: 8,
//         backgroundColor: Gray_900,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//       }}
//     >
//       <Typography.Body color={White_100}>{text}</Typography.Body>
//     </View>
//   );
// };
