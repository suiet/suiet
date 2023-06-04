import Typo from '../../../components/Typo';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import { useForm } from 'react-hook-form';
import { getInputStateByFormState } from '../../../utils/form';
import SettingOneLayout from '../../../layouts/SettingOneLayout';
import Input from '../../../components/Input';
import classNames from 'classnames';

type FormData = {
  privateKey: string;
};

export type ImportPhraseProps = {
  onImported: (privateKey: string) => void;
  privateKey?: string;
};

const ImportPhrase = (props: ImportPhraseProps) => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      privateKey: '',
    },
  });
  const { errors } = form.formState;

  async function handleSubmit(data: FormData) {
    let privateKeyHexString = data.privateKey.trim();
    if (privateKeyHexString.startsWith('0x')) {
      privateKeyHexString = privateKeyHexString.slice(2);
    }
    if (props.onImported) props.onImported(privateKeyHexString);
  }

  return (
    <SettingOneLayout
      titles={['Input', 'Private', 'Key']}
      desc={'From an existing wallet.'}
    >
      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          <div className={classNames('flex items-center w-full')}>
            <Input
              {...form.register('privateKey', {
                required: 'Empty input is not allowed',
              })}
              className="flex-1"
              elClassName={'w-full h-[154px]'}
              type={'password'}
              state={getInputStateByFormState(form.formState, 'privateKey')}
              placeholder={`Paste your private key here`}
            />

            {errors?.privateKey && (
              <Typo.Hints className="text-red-500">
                {errors.privateKey.message}
              </Typo.Hints>
            )}
          </div>
          <Typo.Hints className={'mt-[6px]'}>
            Displayed when you first created your wallet.
          </Typo.Hints>

          <Button type={'submit'} state={'primary'} className={'mt-[24px]'}>
            Confirm and Import
          </Button>
        </Form>
      </section>
    </SettingOneLayout>
  );
};

export default ImportPhrase;
