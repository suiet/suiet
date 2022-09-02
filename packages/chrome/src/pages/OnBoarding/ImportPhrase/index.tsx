import classnames from 'classnames';
import commonStyles from '../common.module.scss';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import Textarea from '../../../components/Textarea';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import FormControl from '../../../components/form/FormControl';
import { useForm } from 'react-hook-form';
import { coreApi } from '@suiet/core';
import { getInputStateByFormState } from '../../../utils/form';

type FormData = {
  secret: string;
};

export type ImportPhraseProps = {
  onImported: (secret: string) => void;
};

const ImportPhrase = ({ onImported }: ImportPhraseProps) => {
  const form = useForm({
    mode: 'onBlur',
    defaultValues: {
      secret: '',
    },
  });

  function handleSubmit(data: FormData) {
    if (onImported) onImported(data.secret);
  }

  return (
    <div className={commonStyles['container']}>
      <Typo.Title className={commonStyles['step-title']}>
        Input
        <br />
        Recovery
        <br />
        Phrase
      </Typo.Title>
      <Typo.Normal className={commonStyles['step-desc']}>
        From an existing wallet.
      </Typo.Normal>

      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          <FormControl
            name={'secret'}
            registerOptions={{
              required: 'Phrase should not be empty',
              validate: (val: string) => {
                return coreApi.wallet.validateMnemonic(val)
                  ? true
                  : 'Phrase is not valid';
              },
            }}
          >
            <Textarea
              state={getInputStateByFormState(form.formState, 'secret')}
              className={'mt-[6px]'}
              elStyle={{
                height: '154px',
              }}
              placeholder={'paste recovery phrase or private key...'}
            />
          </FormControl>
          <Typo.Hints className={'mt-[6px]'}>
            Displayed when you first created your wallet.
          </Typo.Hints>

          <Button type={'submit'} state={'primary'} className={'mt-[24px]'}>
            Confirm
          </Button>
        </Form>
      </section>
    </div>
  );
};

export default ImportPhrase;
