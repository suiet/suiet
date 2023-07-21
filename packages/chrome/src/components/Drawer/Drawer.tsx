import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import Icon from '../icons/Icon';
import { IconContainer } from '../icons';
import { colors } from '../../styles';
import { Extendable } from '../../types';

export type DrawerProps = Extendable & {
  title?: string;
  height?: string;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export const Drawer = (props: DrawerProps) => {
  if (!props.open) {
    return null;
  }
  return (
    <Dialog.Root
      defaultOpen={true}
      onOpenChange={(open) => {
        if (open) {
          props.onOpen && props.onOpen();
        } else {
          props.onClose && props.onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={classNames(
            'w-full h-[100vh] fixed top-0 backdrop-blur bg-[rgba(239, 241, 245, 0.1)] z-10'
          )}
        />
        <Dialog.Content
          className={classNames(
            'w-full bg-white fixed bottom-0 z-10 transition-all rounded-t-[16px] overflow-y-auto no-scrollbar',
            props.className
          )}
          style={Object.assign({}, props.style, {
            height: props.height || '80vh',
          })}
        >
          <header
            className={
              'p-[12px] flex justify-center items-center sticky top-0 bg-white z-10'
            }
          >
            <Dialog.Close className={'absolute left-[12px] top-[12px]'}>
              <IconContainer
                color={colors['gray-100']}
                shape={'circle'}
                className={'w-[32px] h-[32px] hover:bg-gray-300'}
              >
                <Icon
                  icon={'Close'}
                  width={'12px'}
                  height={'12px'}
                  stroke={colors['gray-600']}
                />
              </IconContainer>
            </Dialog.Close>
            {props.title && (
              <Dialog.Title className={'text-xl font-semibold text-gray-700'}>
                {props.title}
              </Dialog.Title>
            )}
          </header>
          {props.children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
