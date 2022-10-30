import { Extendable } from '../../../types';
import Modal from '../../Modal';
import Button from '../../Button';
import FormControl from '../../form/FormControl';
import {
  getInputStateByFormState,
  getPasswordValidation,
} from '../../../utils/form';
import Input from '../../Input';
import Form from '../../form/Form';
import { useForm } from 'react-hook-form';
import Alert from '../../Alert';
import { useApiClient } from '../../../hooks/useApiClient';
import styles from './index.module.scss';
import SettingTwoLayout from '../../../layouts/SettingTwoLayout';
import { ReactComponent as IconError } from '../../../assets/icons/error.svg';
import Icon from '../../Icon';
import Typo from '../../../components/Typo';
export type PasswordConfirmModalProps = Extendable & {
  trigger: JSX.Element;
  actionDesc: string;
  title?: string;
  onOpenChange?: () => void;
  onConfirm: () => void;
};

export type WarningDescriptionProps = Extendable & {
  icon: JSX.Element;
  title: string;
  description: string;
};

type FormData = {
  password: string;
};

const WarningDescription = (props: WarningDescriptionProps) => {
  return (
    <div className={styles['warning-description']}>
      <div className={styles['warning-description__icon']}>{props.icon}</div>
      <div className={styles['warning-description__title']}>{props.title}</div>
      <div className={styles['warning-description__desc']}>
        {props.description}
      </div>
    </div>
  );
};

const PasswordConfirmModal = (props: PasswordConfirmModalProps) => {
  const { title = 'Warning' } = props;
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
      title={''}
      trigger={props.trigger}
      contentProps={{
        className: styles['modal'],
      }}
      onOpenChange={props.onOpenChange}
    >
      <SettingTwoLayout className={'!p-0'}>
        <div className="flex flex-col items-center gap-[8px]">
          <Icon elClassName={styles['icon']} icon={<IconError />} />
          <Typo.Title className={styles['title']}>Warning</Typo.Title>
        </div>

        {/* <Alert type={'warning'} className={'mt-[32px]'}>
          {props.actionDesc}
        </Alert> */}
        {/* <div className={'mt-[16px]'}>
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
          </Form>
        </div> */}

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
            </div>
          </Form>
        </div>
      </SettingTwoLayout>
    </Modal>
  );
};

export default PasswordConfirmModal;
