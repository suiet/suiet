import { Text, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { default as ReactNativeModal } from 'react-native-modal';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { SvgClose } from '@components/icons/constants';
import { Gray_100, Gray_700 } from '@styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ModalProps = {
  title: string;
  isVisible?: boolean;
  onRequestClose?: () => void;
};

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  isVisible,
  onRequestClose,
  children,
}) => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ReactNativeModal
      swipeDirection={'down'}
      onSwipeComplete={onRequestClose}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      propagateSwipe={true}
      isVisible={isVisible}
      avoidKeyboard
      /**
       * @see https://github.com/react-native-modal/react-native-modal/issues/268#issuecomment-493464419
       */
      backdropTransitionOutTiming={0}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={{ flexGrow: 1 }} />
      </TouchableWithoutFeedback>
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
              {title}
            </Text>
            <TouchableOpacity onPress={onRequestClose}>
              <SvgXml style={{ margin: 24 }} width={20} height={20} color={Gray_700} xml={SvgClose} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ marginTop: 68, paddingHorizontal: 24 }}>
          {children}
          <View style={{ height: bottom }} />
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};
