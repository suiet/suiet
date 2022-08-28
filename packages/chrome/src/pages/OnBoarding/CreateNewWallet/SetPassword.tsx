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
  const {register, handleSubmit, formState} = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      password: ''
    }
  })

  async function unlock(data: FormData) {
    props.onNext(data.password);
  }

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]',
          'w-full'
        )
      }>Set <br /> wallet <br /> password</Typo.Title>
      <Typo.Normal className={classnames(
        'mt-4',
        'w-full',
        'text-base',
        'text-left')}>Used to unlock your wallet.</Typo.Normal>

      <section className={'mt-12 w-full'}>
        <form onSubmit={handleSubmit(unlock)}>
        <div>
          <Typo.Small className={styles['pwd']}>Password</Typo.Small>
          <Input
            {...register('password', {
              required: 'Password should not be empty',
              validate: (val: string) => {
                const result = val.length < 6 ? 'Password should be longer than 6' : true
                console.log('validate', result)
                return result
              }
            })}
            type={'password'}
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
            'w-full',
            'mt-8'
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