import Typo from '../../../components/Typo';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import FormControl from '../../../components/form/FormControl';
import { useForm } from 'react-hook-form';
import { getInputStateByFormState } from '../../../utils/form';
import { useApiClient } from '../../../hooks/useApiClient';
import SettingOneLayout from '../../../layouts/SettingOneLayout';
import Input from '../../../components/Input';
import { useState } from 'react';
import classNames from 'classnames';

type FormData = {
  secrets: [string];
};

export type ImportPhraseProps = {
  onImported: (secrets: [string]) => void;
  phrases?: string;
};

const ImportPhrase = (props: ImportPhraseProps) => {
  const apiClient = useApiClient();
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      secrets: props.phrases?.split(' '),
    },
  });
  const [focus, setFocus] = useState([...Array(12).keys()].map(() => false));

  async function handleSubmit(data: FormData) {
    const secret = data['secrets'].join(' ');
    const result = await apiClient.callFunc<string, boolean>(
      'wallet.validateMnemonic',
      secret
    );
    if (!result) {
      // form.setError('secret', new Error('Phrase is not valid'));
      return;
    }
    if (props.onImported) props.onImported(data.secrets);
  }

  return (
    <SettingOneLayout
      titles={['Input', 'Recovery', 'Phrase']}
      desc={'From an existing wallet.'}
    >
      {JSON.stringify(form.watch())}
      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          {/* <FormControl
            name={'secret'}
            registerOptions={{
              required: 'Phrase should not be empty',
            }}
          >
            <Input
              type={'password'}
              state={getInputStateByFormState(form.formState, 'secret')}
              className={'mt-[6px]'}
              placeholder={'paste recovery phrase...'}
            />
          </FormControl> */}

          {[...Array(12).keys()].map((i) => (
            <FormControl
              key={i}
              name={'secrets[' + String(i) + ']'}
              registerOptions={{
                required: 'Phrase should not be empty',
              }}
            >
              <Input
                type={focus[i] ? 'text' : 'password'}
                state={getInputStateByFormState(
                  form.formState,
                  'secrets[' + String(i) + ']'
                )}
                // support detect paste with space
                onKeyUp={(e) => {
                  const inputValues = form.getValues('secrets');

                  console.log(inputValues);
                  if (inputValues) {
                    const currentInput = inputValues[i].trim();
                    if (currentInput.includes(' ')) {
                      const followingInputs = currentInput.split(' ');
                      if (followingInputs.length + i > 12) {
                        return;
                      }

                      form.setValue(
                        'secrets',
                        inputValues
                          .slice(0, i)
                          .concat(followingInputs)
                          .concat(
                            inputValues.slice(i + followingInputs.length, 12)
                          )
                      );

                      // inputValues[]
                      // inputValues.forEach((value, index) => {
                      //   form.setValue(`secrets[${index}]`, value);
                      // });
                    }
                  }
                  // if (inputValues && ' ' in inputValues[i]) {
                  //   inputValues.forEach((value, index) => {
                  //     form.setValue('secret', value);
                  //   });
                  // }
                }}
                // onChange={(input) => {
                //   console.log(input);
                //   if (' ' in input) {
                //     const inputValues = String(input).split(' ');

                //     inputValues.forEach((value, index) => {
                //       form.setValue(
                //         'secrets[' + (index + i).toString() + ']',
                //         value
                //       );
                //     });
                //   }
                // }}
                onFocus={() => {
                  setFocus(focus.map((_, idx) => idx === i));
                }}
                className={classNames('mt-[6px]')}
                placeholder={(i + 1).toString() + '.'}
              />
            </FormControl>
          ))}
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
