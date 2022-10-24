import { Extendable } from '../../../types';
import Modal from '../../Modal';
import Button from '../../Button';
import FormControl from '../../form/FormControl';
import {
  getInputStateByFormState,
  getPasswordValidation,
} from '../../../utils/form';
import Input from '../../Input';
import BiometricAuth from '../../BiometricAuth';
import Form from '../../form/Form';
import { useForm } from 'react-hook-form';
import Alert from '../../Alert';
import { useApiClient } from '../../../hooks/useApiClient';

export type PasswordConfirmModalProps = Extendable & {
  trigger: JSX.Element;
  actionDesc: string;
  title?: string;
  onOpenChange?: () => void;
  onConfirm: () => void;
};

type FormData = {
  password: string;
};

const PasswordConfirmModal = (props: PasswordConfirmModalProps) => {
  const { title = 'Password Confirm' } = props;
  const apiClient = useApiClient();

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      password: '',
    },
  });
  async function handleSubmit(data: FormData) {
    const result = await apiClient.callFunc<string, string>(
      'auth.verifyPassword',
      data.password
    );
    if (!result) {
      form.setError('password', {
        type: 'custom',
        message: 'Password is incorrect, please try again',
      });
      return;
    }
    props.onConfirm();
  }

  return (
    <Modal
      title={title}
      trigger={props.trigger}
      onOpenChange={props.onOpenChange}
    >
      <Alert type={'warning'} className={'mt-[8px]'}>
        {props.actionDesc}
      </Alert>

      <div className={'mt-[16px]'}>
        <Form form={form} onSubmit={handleSubmit}>
          <FormControl
            name={'password'}
            registerOptions={getPasswordValidation()}
          >
            <Input
              state={getInputStateByFormState(form.formState, 'password')}
              type={'password'}
              placeholder={'Please enter password'}
            />
          </FormControl>

          <div className={'flex items-center mt-[16px]'}>
            <Button type={'submit'} state={'primary'}>
              Confirm
            </Button>
            {/* <BiometricAuth className={'ml-[8px]'} onSuccess={props.onConfirm} /> */}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default PasswordConfirmModal;
