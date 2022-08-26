import styles from "./index.module.scss";
import Typo from "../../components/Typo";
import classnames from "classnames";
import Input from "../../components/Input";
import LinkButton from "../OnBoarding/LinkButton";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import {useForm} from 'react-hook-form'
import {ErrorMessage} from "@hookform/error-message";
import React from "react";

type FormData = {
  password: string;
}

const LoginPage = () => {
  const {login} = useAuth();
  const {state}: any = useLocation();
  const {register, handleSubmit, formState} = useForm<FormData>()
  const navigate = useNavigate();

  async function unlock(data: FormData) {
    await login(data.password);
    navigate(state?.path || '/')
  }

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]'
        )
      }>Unlock Wallet</Typo.Title>
      <section className={'mt-[214px] w-full px-[22px]'}>
        <form onSubmit={handleSubmit(unlock)}>
          <div>
            <Typo.Small className={styles['pwd']}>Password</Typo.Small>
            <Input
              {...register('password', {
                required: 'Password should not be empty'
              })}
              className={'mt-[6px]'}
              placeholder={'Please enter the password'}
            />
            <ErrorMessage
              errors={formState.errors}
              name={'password'}
              render={(error) => (
                <Typo.Hints state={'error'} className={'mt-[6px]'}>{error.message}</Typo.Hints>
              )}
            />
          </div>
          <LinkButton
            type={'submit'}
            theme={'primary'}
            className={classnames(
              styles['step-button'],
              'mt-[16px]'
            )}
          >
            Unlock
          </LinkButton>
        </form>
      </section>
    </div>
  )
}

export default LoginPage;