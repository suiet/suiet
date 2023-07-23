import { Gray_500, Gray_900 } from '@/styles/colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from '@/components/Typography';
import { ToastProps } from 'react-native-toast-message';
import { SvgXml } from 'react-native-svg';
import { SvgCopy03 } from '@/components/icons/svgs';

export interface CopiableMonoProps {
  text: string;
  textToCopy?: string;
}

const CopiableMono: React.FC<CopiableMonoProps> = ({ text, textToCopy }) => {
  const copy = async (text: string) => {
    const Clipboard = await import('expo-clipboard');
    const { default: Toast } = await import('react-native-toast-message');

    try {
      await Clipboard.setStringAsync(textToCopy ?? text);
      Toast.show({
        type: 'info',
        text1: 'Copied to clipboard!',
        props: {
          icon: require('@assets/magic_wand.png'),
        } as ToastProps,
      });
    } catch (e) {}
  };

  return (
    <TouchableOpacity
      style={{
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        maxWidth: '60%',
      }}
      onPress={() => copy(text)}
    >
      <Typography.Mono
        style={{ flexShrink: 1, textAlign: 'right' }}
        color={Gray_500}
        children={text}
        numberOfLines={1}
      />
      <SvgXml width={14} height={14} color={Gray_500} xml={SvgCopy03} />
    </TouchableOpacity>
  );
};

export interface NamedCopiableMonoProps {
  name: string;
  text: string;
  textToCopy?: string;
}

export const NamedCopiableMono: React.FC<NamedCopiableMonoProps> = ({ name, text, textToCopy }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
      <Typography.LabelS color={Gray_900} children={name} />
      <CopiableMono text={text} textToCopy={textToCopy} />
    </View>
  );
};

// export interface NamedCopiableMonoMultiValueProps {
//   name: string;
//   texts: string[];
//   textsToCopy?: string[];
// }

// export const NamedCopiableMonoMultiValue: React.FC<NamedCopiableMonoMultiValueProps> = ({
//   name,
//   texts,
//   textsToCopy,
// }) => {
//   return (
//     <View>

//       {texts.map((text, i) => (
//         <NamedCopiableMono key={text} name={i === 0 ? name : ''} text={text} textToCopy={textsToCopy?.[i]} />
//       ))}
//     </View>
//   );
// };
