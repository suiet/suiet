import commonStyles from "../common.module.scss";
import Typo from "../../../components/Typo";
import classnames from "classnames";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {useForm} from "react-hook-form";
import React, {useState} from "react";
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
    mode: 'onBlur',
    defaultValues: {
      password: ''
    }
  })
  const [password, setPassword] = useState('')

  return (
    <div className={commonStyles['container']}>
      <Typo.Title className={commonStyles['step-title']}>
        Set <br/> wallet <br/> password
      </Typo.Title>
      <Typo.Normal className={commonStyles['step-desc']}>
        Used to unlock your wallet.
      </Typo.Normal>

      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={(data) => {
          props.onNext(data.password);
        }}>
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
            className={'mt-[28px]'}
          >Next</Button>
        </Form>
      </section>
    </div>
  )
}

export default SavePassword;