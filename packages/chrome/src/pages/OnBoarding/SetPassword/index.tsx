import commonStyles from "../common.module.scss";
import Typo from "../../../components/Typo";
import classnames from "classnames";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {useForm} from "react-hook-form";
import React, {useRef, useState} from "react";
import {getInputStateByFormState, getPasswordValidation} from "../../../utils/form";
import Form from "../../../components/form/Form";
import FormControl from "../../../components/form/FormControl";

export type SavePasswordProps = {
  onNext: (password: string) => void;
}

type FormData = {
  password: string;
  confirmPassword: string;
}

const SavePassword = (props: SavePasswordProps) => {
  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      password: ''
    }
  })
  const [password, setPassword] = useState('')

  async function unlock(data: FormData) {
    props.onNext(data.password);
  }

  return (
    <div className={commonStyles['container']}>
      <Typo.Title className={
        classnames(
          commonStyles['step-title'],
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
        <Form form={form} onSubmit={unlock}>
          <div>
            <Typo.Small>Password</Typo.Small>
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
          <div className={'mt-[16px]'}>
            <Typo.Small>Confirm Password</Typo.Small>
            <FormControl
              name={'confirmPassword'}
              registerOptions={getPasswordValidation({
                previousPassword: password
              })}
            >
              <Input
                type={'password'}
                state={getInputStateByFormState(form.formState, 'confirmPassword')}
                className={'mt-[6px]'}
                placeholder={'Please enter the password'}
                disabled={!password || password.length < 6}
              />
            </FormControl>
          </div>

          <Button
            type={'submit'}
            state={'primary'}
            className={'mt-8'}
          >Next</Button>
        </Form>
      </section>
    </div>
  )
}

export default SavePassword;