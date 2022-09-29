import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import Input from '../../../components/Input';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  getInputStateByFormState,
  getPasswordValidation,
} from '../../../utils/form';
import Form from '../../../components/form/Form';
import FormControl from '../../../components/form/FormControl';
import { useLocation } from 'react-router-dom';
import StepButton from '../../../components/Button/StepButton';
import { Extendable } from '../../../types';
import SettingOneLayout from '../../../layouts/SettingOneLayout';

export type SavePasswordProps = Extendable & {
  onNext: (password: string, oldPassword?: string) => void;
};

type FormData = {
  password: string;
  confirmPassword: string;
};

const SavePassword = (props: SavePasswordProps) => {
  const form = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
    },
  });
  const location = useLocation();
  const state = (location.state || {}) as Record<string, any>;
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  return (
    <SettingOneLayout
      titles={['Set', 'wallet', 'password']}
      desc={'Used to unlock your wallet.'}
    >
      <section className={'mt-[24px] w-full'}>
        <Form
          form={form}
          onSubmit={(data) => {
            props.onNext(data.password, oldPassword);
          }}
        >
          {state.hasOldPassword && (
            <div className={styles['control-group']}>
              <Typo.Small className={styles['control-label']}>
                Old Password
              </Typo.Small>
              <FormControl
                name={'oldpassword'}
                registerOptions={getPasswordValidation()}
              >
                <Input
                  type={'password'}
                  state={getInputStateByFormState(
                    form.formState,
                    'oldpassword'
                  )}
                  className={'mt-[6px]'}
                  placeholder={'Please enter the password'}
                  onInput={(e) => {
                    const target = e.target as any;
                    setOldPassword(target.value);
                  }}
                />
              </FormControl>
            </div>
          )}
          <div className={styles['control-group']}>
            <Typo.Small className={styles['control-label']}>
              Password
            </Typo.Small>
            <FormControl
              name={'password'}
              registerOptions={getPasswordValidation()}
            >
              <Input
                type={'password'}
                state={getInputStateByFormState(form.formState, 'password')}
                className={'mt-[6px]'}
                placeholder={'Please enter the password'}
                onInput={(e) => {
                  const target = e.target as any;
                  setPassword(target.value);
                }}
              />
            </FormControl>
          </div>
          <div className={styles['control-group']}>
            <Typo.Small className={styles['control-label']}>
              Confirm Password
            </Typo.Small>
            <FormControl
              name={'confirmPassword'}
              registerOptions={getPasswordValidation({
                previousPassword: password,
              })}
            >
              <Input
                type={'password'}
                state={getInputStateByFormState(
                  form.formState,
                  'confirmPassword'
                )}
                className={'mt-[6px]'}
                placeholder={'Re-enter the same password'}
                disabled={!password || password.length < 6}
              />
            </FormControl>
          </div>

          <StepButton
            type={'submit'}
            state={'primary'}
            className={'mt-[28px] w-[160px]'}
          >
            Next Step
          </StepButton>
        </Form>
      </section>
    </SettingOneLayout>
  );
};

export default SavePassword;
