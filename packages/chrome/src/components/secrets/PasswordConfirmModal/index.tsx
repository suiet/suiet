import { Extendable } from '../../../types';
import Modal from '../../Modal';
import Button from '../../Button';
import FormControl from '../../form/FormControl';
import { getInputStateByFormState } from '../../../utils/form';
import Input from '../../Input';
import Form from '../../form/Form';
import { useForm } from 'react-hook-form';
import Alert from '../../Alert';
import { useApiClient } from '../../../hooks/useApiClient';
import styles from './index.module.scss';
import SettingTwoLayout from '../../../layouts/SettingTwoLayout';
import { ReactComponent as IconError } from '../../../assets/icons/error.svg';
import { ReactComponent as IconKey } from '../../../assets/icons/key.svg';
import { ReactComponent as IconShareError } from '../../../assets/icons/share-error.svg';
import { ReactComponent as IconQuestionError } from '../../../assets/icons/question-error.svg';
import Icon from '../../Icon';
import Typo from '../../../components/Typo';
import classnames from 'classnames';
import * as DialogPrimitive from '@radix-ui/react-dialog';
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
      <div className="flex gap-[8px] items-center">
        <div className={styles['warning-description__icon']}>{props.icon}</div>
        <div className={styles['warning-description__title']}>
          {props.title}
        </div>
      </div>
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
        className: styles['modal'] + ' overflow-scroll h-[100vh] no-scrollbar',
      }}
      onOpenChange={props.onOpenChange}
    >
      <SettingTwoLayout className={classnames('!pb-[128px]', '!p-0')}>
        <div className="flex flex-col items-center gap-[8px]">
          <Icon elClassName={styles['icon']} icon={<IconError />} />
          <Typo.Title className={styles['title']}>Warning</Typo.Title>
        </div>
        <div className="mt-[24px] mb-60px">
          <WarningDescription
            icon={<IconKey />}
            title={'Full control of your wallet'}
            description={
              'Anyone with the private key or recovery phrases can have full control of your wallet funds and assets.'
            }
          />
          <WarningDescription
            icon={<IconShareError />}
            title={'Never share with anyone'}
            description={
              'You should not share your private key or  recovery phrases with anyone, or type in any applications.'
            }
          />
          <WarningDescription
            icon={<IconQuestionError />}
            title={'Suiet will never ask for it'}
            description={
              'Suiet will never ask for your private key or recovery phrases.'
            }
          />
        </div>

        <div
          className={classnames(
            styles['password-confirm'],
            'fixed',
            'bottom-0',
            'left-0',
            'w-screen'
          )}
        >
          <Form form={form} onSubmit={handleSubmit}>
            <FormControl name={'password'}>
              <Input
                state={getInputStateByFormState(form.formState, 'password')}
                type={'password'}
                placeholder={'Please enter password'}
              />
            </FormControl>

            <div className={'flex items-center mt-[16px] gap-[8px]'}>
              <DialogPrimitive.Close className="w-full" aria-label="Close">
                <Button type={'submit'} solidBackground={true}>
                  Cancel
                </Button>
              </DialogPrimitive.Close>

              <Button type={'submit'} state={'danger'} solidBackground={true}>
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
