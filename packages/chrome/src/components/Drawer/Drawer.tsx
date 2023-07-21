import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import Icon from '../icons/Icon';
import { IconContainer } from '../icons';
import { colors } from '../../styles';
import { Extendable } from '../../types';
import { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

export type DrawerProps = Extendable & {
  title?: string;
  height?: string;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export const Drawer = (props: DrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { height = '80vh' } = props;
  const { posY } = useSpring({
    posY: props.open ? '0' : height,
  });

  useEffect(() => {
    if (props.open) {
      setInternalOpen(true);
    } else {
      setTimeout(() => {
        setInternalOpen(false);
      }, 300);
    }
  }, [props.open]);

  return (
    <Dialog.Root
      open={internalOpen}
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
        <Dialog.Content asChild={true}>
          <animated.div
            className={classNames(
              'absolute bottom-0 z-10 flex flex-col w-full bg-white rounded-t-[16px] overflow-y-auto no-scrollbar',
              props.className
            )}
            style={Object.assign(
              {
                transform: posY.to((y) => `translateY(${y})`),
              },
              props.style,
              {
                height: props.height || '80vh',
              }
            )}
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
            <div className={'flex-1 flex flex-col'}>{props.children}</div>
          </animated.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
