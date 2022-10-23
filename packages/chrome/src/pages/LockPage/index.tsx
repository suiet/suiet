import Typo from '../../components/Typo';
import Button from '../../components/Button';
import Form from '../../components/form/Form';
import FormControl from '../../components/form/FormControl';
import { useForm } from 'react-hook-form';
import {
  getInputStateByFormState,
  getPasswordValidation,
} from '../../utils/form';
import Input from '../../components/Input';
import { useDispatch } from 'react-redux';
import { updateAuthed } from '../../store/app-context';
import { useState } from 'react';
import ForgetPassword from './ForgetPassword';
import Nav from '../../components/Nav';
import { AppDispatch } from '../../store';
import { useApiClient } from '../../hooks/useApiClient';
import BrandLayout from '../../layouts/BrandLayout';
import BiometricAuth from '../../components/BiometricAuth';

type FormData = {
  password: string;
};

const LockPage = () => {
  const apiClient = useApiClient();
  const form = useForm({
    mode: 'onSubmit',
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
        />
        <ForgetPassword />
      </div>
    );
  }
  return (
    <BrandLayout
      grayTitle={'Back to'}
      blackTitle={'Suiet'}
      desc={'The wallet for everyone.'}
    >
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

          <Button type={'submit'} state={'primary'} className={'mt-[24px]'}>
            Unlock
          </Button>
          <BiometricAuth />
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
    </BrandLayout>
  );
};

export default LockPage;
