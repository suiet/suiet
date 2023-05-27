import * as Dialog from '@radix-ui/react-dialog';
import styles from '../Modal/index.module.scss';
import classnames from 'classnames';
import React, { ReactNode } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
import Typo from '../../Typo';
import Form from '../../form/Form';
import Button from '../../Button';
import Input from '../../Input';
import { getInputStateByFormState } from '../../../utils/form';
import FormControl from '../../form/FormControl';
import { useForm } from 'react-hook-form';
import { Icon, IconContainer } from '../../icons';
import { Extendable } from '../../../types';
import classNames from 'classnames';

export type ActionConfirmModalProps = DialogProps &
  Extendable & {
    trigger?: ReactNode;
    confirmString: string;
    placeholder?: string;
    title: ReactNode;
    desc?: ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };

type FormData = {
  confirmString: string;
};

const ActionConfirmModal = (props: ActionConfirmModalProps) => {
  const {
    children,
    trigger,
    confirmString,
    placeholder,
    confirmText = 'Confirm',
    className,
    ...restProps
  } = props;

  const form = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      confirmString: '',
    },
  });

  const handleSubmit = (data: FormData) => {
    if (data.confirmString === confirmString) {
      props.onConfirm?.();
    }
  };

  const handleCancel = () => {
    props.onCancel?.();
  };

  return (
    <Dialog.Root {...restProps}>
      {trigger && <Dialog.Trigger asChild={true}>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={classNames(styles['overlay'], className)}>
          <Dialog.Content
            className={classnames(
              'w-full bg-white rounded-2xl px-[16px] py-[24px] mx-[16px] shadow-lg border-2'
            )}
          >
            <div className="flex gap-2 align-middle">
              <IconContainer
                shape={'circle'}
                color={'bg-red-50'}
                className={'w-[48px] h-[48px]'}
              >
                <Icon icon={'Warning'} width={'28px'} height={'28px'} />
              </IconContainer>
              <Typo.Title className={'font-bold text-large my-auto'}>
                {props.title}
              </Typo.Title>
            </div>
            <Typo.Normal className={'font-normal text-medium mt-[8px]'}>
              {props.desc}
            </Typo.Normal>

            <Form form={form} onSubmit={handleSubmit}>
              <FormControl
                name={'confirmString'}
                registerOptions={{
                  required: 'input should not be empty',
                  validate: (val) =>
                    val !== confirmString
                      ? `The input does not match with: ${confirmString}`
                      : true,
                }}
              >
                <Input
                  state={getInputStateByFormState(
                    form.formState,
                    'confirmString'
                  )}
                  className={'mt-[16px]'}
                  placeholder={placeholder}
                />
              </FormControl>
              <div className={'mt-[24px] flex justify-between items-center'}>
                <Button type={'submit'} state={'danger'}>
                  {confirmText}
                </Button>
                <Dialog.Close asChild={true} className={'ml-[16px]'}>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Dialog.Close>
              </div>
            </Form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ActionConfirmModal;
