import classnames from "classnames";
import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import Textarea from "../../../components/Textarea";
import Button from "../../../components/Button";
import Form from "../../../components/form/Form";
import FormControl from "../../../components/form/FormControl";
import {useForm} from "react-hook-form";
import {coreApi} from "@suiet/core";
import {getInputStateByFormState} from "../../../utils/form";

type FormData = {
  secret: string;
}

export type ImportPhraseProps = {
  onImported: (secret: string) => void;
}

const ImportPhrase = ({onImported}: ImportPhraseProps) => {
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      secret: ''
    }
  })

  function handleSubmit(data: FormData) {
    if (onImported) onImported(data.secret);
  }

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-12',
          'w-full'
        )
      }>Import<br/>Your<br/>Wallet</Typo.Title>
      <Typo.Normal
        className={classnames(
          'mt-2',
          'w-full',
          'text-base',
          'text-left')}
      >Using recovery phrase or secret key</Typo.Normal>


      <section className={'mt-[32px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          <FormControl
            name={'secret'}
            registerOptions={{
              required: 'Phrase should not be empty',
              validate: (val: string) => {
                return coreApi.validateMnemonic(val) ? true : 'Phrase is not valid';
              }
            }}
          >
            <Textarea
              state={getInputStateByFormState(form.formState, 'secret')}
              className={'mt-[6px]'}
              elClassName={styles['phrase-textarea']}
              placeholder={'paste recovery phrase or private key...'}
            />
          </FormControl>
          <Button
            type={'submit'}
            state={'primary'}
            className={'mt-[24px]'}
          >Confirm</Button>
        </Form>
      </section>
    </div>
  )
}

export default ImportPhrase;