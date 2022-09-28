import welcomeStyles from '../Welcome/index.module.scss';
import commonStyles from '../common.module.scss';
import Typo from '../../../components/Typo';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import FormControl from '../../../components/form/FormControl';
import { useForm } from 'react-hook-form';
import {
  getButtonDisabledState,
  getInputStateByFormState,
  getPasswordValidation,
} from '../../../utils/form';
import Icon from '../../../components/Icon';
import { ReactComponent as LogoGrey } from '../../../assets/icons/logo-grey.svg';
import classnames from 'classnames';
import Input from '../../../components/Input';
import { useDispatch } from 'react-redux';
import { resetAppContext, updateAuthed } from '../../../store/app-context';
import { useState } from 'react';
import ForgetPassword from '../ForgetPassword';
import Nav from '../../../components/Nav';
import { AppDispatch } from '../../../store';
import { useApiClient } from '../../../hooks/useApiClient';

type FormData = {
  password: string;
};

const LoginPage = () => {
  const apiClient = useApiClient();
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      password: '',
    },
  });
  const [step, setStep] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

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
    // update backend token
    await apiClient.callFunc<string, string>('auth.login', data.password);
    // effect Session Guard Component
    dispatch(updateAuthed(true));
  }

  if (step === 2) {
    return (
      <div>
        <Nav
          title={'Forget Password'}
          onNavBack={() => {
            setStep(1);
          }}
        ></Nav>
        <ForgetPassword
          onConfirmReset={async () => {
            await apiClient.callFunc<null, undefined>(
              'root.resetAppData',
              null
            );
            await dispatch(resetAppContext()).unwrap();
          }}
        />
      </div>
    );
  }
  return (
    <div className={welcomeStyles['main-page']}>
      <Icon elClassName={commonStyles['logo']} icon={<LogoGrey />} />

      <Typo.Title
        className={classnames(welcomeStyles['suiet-title'], 'mt-[64px]')}
      >
        Back to
      </Typo.Title>
      <Typo.Title
        className={classnames(
          welcomeStyles['suiet-title'],
          welcomeStyles['suiet-title--black']
        )}
      >
        Suiet
      </Typo.Title>
      <Typo.Normal className={welcomeStyles['suiet-desc']}>
        The wallet for everyone.
      </Typo.Normal>

      <section className={'mt-[50px] w-full'}>
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

          <Button
            type={'submit'}
            state={'primary'}
            disabled={getButtonDisabledState(form.formState)}
            className={'mt-[24px]'}
          >
            Unlock
          </Button>
        </Form>
      </section>
      <Typo.Normal
        className={'mt-auto cursor-pointer'}
        onClick={() => {
          setStep(2);
        }}
      >
        Forget Password?
      </Typo.Normal>
    </div>
  );
};

export default LoginPage;
