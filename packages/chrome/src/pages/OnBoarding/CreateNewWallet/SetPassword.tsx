import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import classnames from "classnames";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {CreateWalletStepProps} from "./index";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import React from "react";
import {getInputStateByFormState, getPasswordValidation} from "../../../utils/form";

export type SavePasswordProps = {
  onNext: (password: string) => void;
}

type FormData = {
  password: string;
}

const SavePassword = (props: SavePasswordProps) => {
  const {register, handleSubmit, formState} = useForm<FormData>()

  async function unlock(data: FormData) {
    props.onNext('123456')
  }

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]'
        )
      }>Set wallet password</Typo.Title>
      <section className={'mt-[214px] w-full px-[22px]'}>
        <form onSubmit={handleSubmit(unlock)}>
        <div>
          <Typo.Small className={styles['pwd']}>Password</Typo.Small>
          <Input
            {...register('password', getPasswordValidation())}
            state={getInputStateByFormState(formState, 'password')}
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
        <Button
          type={'submit'}
          state={'primary'}
          className={classnames(
            styles['step-button'],
            'mt-[16px]'
          )}
        >
          Next
        </Button>
        </form>
      </section>
    </div>
  )
}

export default SavePassword;