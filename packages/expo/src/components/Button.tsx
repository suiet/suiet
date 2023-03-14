import { Primary_500 } from '@/styles/colors';
import {
  TextStyle,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
  Text,
} from 'react-native';

export const Button: React.FC<
  { title: string; innerStyle?: ViewStyle; textStyle?: TextStyle } & TouchableWithoutFeedbackProps
> = ({ title, innerStyle, textStyle, ...props }) => {
  return (
    <TouchableWithoutFeedback
      {...props}
      children={
        <View
          style={[
            {
              backgroundColor: Primary_500,
              width: '100%',
              height: 48,
              borderRadius: 9999,
              paddingVertical: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
            innerStyle,
          ]}
        >
          <Text
            style={[{ fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 24, color: '#FFFFFF' }, textStyle]}
          >
            {title}
          </Text>
        </View>
      }
    />
  );
};
