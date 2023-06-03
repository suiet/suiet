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
import { validateWord, BIP32_EN_WORDLIST } from '@suiet/core';
import message from '../../../components/message';
import { Select, SelectItem } from '../../../components/Select';

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
  const { errors } = form.formState;
  const [phraseLengthString, setPhraseLengthString] = useState('12');
  const phraseLength = Number(phraseLengthString);
  const [focus, setFocus] = useState(
    [...Array(phraseLength).keys()].map(() => false)
  );

  async function handleSubmit(data: FormData) {
    const secret = data['secrets'].join(' ');
    const result = await apiClient.callFunc<string, boolean>(
      'wallet.validateMnemonic',
      secret
    );
    if (!result) {
      console.log(errors.secrets);
      message.error('Phrase is not valid');
      // form.setError('secret', new Error('Phrase is not valid'));
      return;
    }
    if (props.onImported) props.onImported(data.secrets);
  }

  return (
    <SettingOneLayout
      titles={['Import', 'Recovery', 'Phrase']}
      desc={'From an existing wallet.'}
    >
      {/* {JSON.stringify(errors.secrets)} */}
      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          <Select
            value={phraseLengthString}
            onValueChange={setPhraseLengthString}
            defualtValue={'12'}
          >
            <SelectItem value="12">12 Words</SelectItem>
            <SelectItem value="15">15 Words</SelectItem>
            <SelectItem value="18">18 Words</SelectItem>
            <SelectItem value="21">21 Words</SelectItem>
            <SelectItem value="24">24 Words</SelectItem>
          </Select>
          <datalist id="wordlist">
            {BIP32_EN_WORDLIST.map((word) => (
              <option key={word}>{word}</option>
            ))}
          </datalist>
          <div
            className={classNames('grid', 'grid-cols-3', 'gap-2', 'gap-x-4')}
          >
            {[...Array(phraseLength).keys()].map((i) => (
              <div key={i} className={classNames('flex', 'items-center')}>
                <div className="flex flex-col">
                  <Input
                    {...form.register(`secrets.${i}`, {
                      required: 'phrase is required',
                      validate: {
                        wordCheck: (value) =>
                          validateWord(value) || 'invalid phrase',
                      },
                    })}
                    aria-invalid={
                      errors?.secrets && errors?.secrets[i] ? 'true' : 'false'
                    }
                    className="flex-1 w-[94px] h-[30px]"
                    elStyle={{
                      fontSize: '14px',
                      padding: '10px 10px',
                      height: '40px',
                      borderRadius: '12px',
                      border: '1px solid #E5E5E5',
                      boxShadow: 'none',
                    }}
                    type={focus[i] ? 'text' : 'password'}
                    state={getInputStateByFormState(
                      form.formState,
                      'secrets[' + String(i) + ']'
                    )}
                    // support detect paste with space
                    onPaste={(e) => {
                      /// ashdiahsidh asdiahsidh asd
                      const inputValues = form.getValues('secrets');
                      console.log(e.clipboardData.getData('text'));

                      if (inputValues) {
                        const currentInput = e.clipboardData
                          .getData('text')
                          .trim();
                        if (currentInput.includes(' ')) {
                          let followingInputs = currentInput.split(' ');
                          if (followingInputs.length + i > phraseLength) {
                            followingInputs = followingInputs.slice(
                              0,
                              phraseLength
                            );
                          }

                          const newSecrets = inputValues
                            .slice(0, i)
                            .concat(followingInputs)
                            .concat(
                              inputValues.slice(
                                i + followingInputs.length,
                                phraseLength
                              )
                            );

                          setTimeout(() => {
                            form.reset();
                            form.setValue('secrets', newSecrets);
                          }, 0);
                        }
                      }
                    }}
                    onFocus={() => {
                      setFocus(focus.map((_, idx) => idx === i));
                    }}
                    placeholder={`${i + 1}.`}
                    list="wordlist"
                  />

                  {errors?.secrets && (
                    <Typo.Hints className="text-red-500">
                      {errors.secrets[i]?.message}
                    </Typo.Hints>
                  )}
                </div>
              </div>
            ))}
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
