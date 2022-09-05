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
import { coreApi } from '@suiet/core';
import Icon from '../../../components/Icon';
import { ReactComponent as LogoGrey } from '../../../assets/icons/logo-grey.svg';
import classnames from 'classnames';
import Input from '../../../components/Input';
import { useDispatch, useSelector } from 'react-redux';
import { resetAppContext, updateToken } from '../../../store/app-context';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ForgetPassword from '../ForgetPassword';
import Nav from '../../../components/Nav';
import { AppDispatch, RootState } from '../../../store';

type FormData = {
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      password: '',
    },
  });
  const [step, setStep] = useState(1);
  const token = useSelector((state: RootState) => state.appContext.token);
  const dispatch = useDispatch<AppDispatch>();

  async function requestToken(password: string) {
    try {
      return await coreApi.auth.loadTokenWithPassword(password);
    } catch (e) {
      return '';
    }
  }
  async function handleSubmit(data: FormData) {
    const token = await requestToken(data.password);
    if (!token) {
      form.setError('password', {
        type: 'custom',
        message: 'Password is incorrect, please try again',
      });
      return;
    }
    await dispatch(updateToken(token));
    navigate('/');
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
            await coreApi.resetAppData(token);
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
