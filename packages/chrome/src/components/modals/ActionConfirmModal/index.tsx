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

export type ActionConfirmModalProps = DialogProps & {
  trigger: ReactNode;
  confirmString: string;
  title: string;
  desc?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type FormData = {
  inputString: string;
};

const ActionConfirmModal = (props: ActionConfirmModalProps) => {
  const { children, trigger, confirmString, ...restProps } = props;

  const form = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      inputString: '',
    },
  });

  const handleSubmit = (data: FormData) => {
    if (data.inputString === confirmString) {
      props.onConfirm?.();
    }
  };

  const handleCancel = () => {
    props.onCancel?.();
  };

  return (
    <Dialog.Root {...restProps}>
      <Dialog.Trigger asChild={true}>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles['overlay']}>
          <Dialog.Content
            className={classnames(
              'w-full bg-white rounded-2xl px-[16px] py-[24px] mx-[16px] shadow-lg border-2'
            )}
          >
            <IconContainer
              shape={'circle'}
              color={'bg-red-50'}
              className={'w-[48px] h-[48px]'}
            >
              <Icon icon={'Warning'} width={'28px'} height={'28px'} />
            </IconContainer>
            <Typo.Title className={'font-bold text-large mt-[12px]'}>
              {props.title}
            </Typo.Title>
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
                      ? `Please enter the following to confirm: ${confirmString}`
                      : true,
                }}
              >
                <Input
                  state={getInputStateByFormState(
                    form.formState,
                    'confirmString'
                  )}
                  className={'mt-[16px]'}
                  placeholder={confirmString}
                />
              </FormControl>
              <div className={'mt-[24px] flex justify-between items-center'}>
                <Button type={'submit'} state={'danger'}>
                  Confirm
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
