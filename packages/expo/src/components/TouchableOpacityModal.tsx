import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { Modal, ModalProps } from './Modal';

export type TouchableOpacityModalProps = { modalContent?: ReactNode; modalProps: ModalProps } & TouchableOpacityProps;

export const TouchableOpacityModal: React.FC<PropsWithChildren<TouchableOpacityModalProps>> = ({
  modalProps,
  modalContent,
  children,
  onPress,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <TouchableOpacity
      {...props}
      onPress={(e) => {
        setShowModal(true);
        onPress?.(e);
      }}
    >
      {children}
      <Modal {...modalProps} isVisible={showModal} onRequestClose={() => setShowModal(false)} children={modalContent} />
    </TouchableOpacity>
  );
};
