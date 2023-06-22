import Typo from '../../../../../components/Typo';
import Button from '../../../../../components/Button';
import Form from '../../../../../components/form/Form';
import { useForm } from 'react-hook-form';
import { getInputStateByFormState } from '../../../../../utils/form';
import SettingOneLayout from '../../../../../layouts/SettingOneLayout';
import Input from '../../../../../components/Input';
import classNames from 'classnames';
import { useApiClient } from '../../../../../hooks/useApiClient';
import { ImportWalletParams, Wallet } from '@suiet/core';
import { OmitToken } from '../../../../../types';
import {
  updateAccountId,
  updateWalletId,
} from '../../../../../store/app-context';
import { isNonEmptyArray } from '../../../../../utils/check';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../store';

type FormData = {
  privateKey: string;
};

export type ImportPrivateKeyViewProps = {
  onFinished: () => void;
};

const ImportPrivateKeyView = (props: ImportPrivateKeyViewProps) => {
  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      privateKey: '',
    },
  });
  const { errors } = form.formState;
  const apiClient = useApiClient();
  const dispatch = useDispatch<AppDispatch>();

  const handleImportPrivateKey = async (privateKeyHexString: string) => {
    const wallet = await apiClient.callFunc<
      OmitToken<ImportWalletParams>,
      Wallet
    >(
      'wallet.importWallet',
      {
        private: privateKeyHexString,
      },
      {
        withAuth: true,
      }
    );

    const accounts = wallet.accounts;
    if (!isNonEmptyArray(accounts)) {
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));
  };

  async function handleSubmit(data: FormData) {
    let privateKeyHexString = data.privateKey.trim();
    if (privateKeyHexString.startsWith('0x')) {
      privateKeyHexString = privateKeyHexString.slice(2);
    }
    await handleImportPrivateKey(privateKeyHexString);
    props.onFinished();
  }

  return (
    <SettingOneLayout
      titles={['Import', 'Private', 'Key']}
      desc={'From an existing account.'}
    >
      <section className={'mt-[24px] w-full'}>
        <Form form={form} onSubmit={handleSubmit}>
          <div className={classNames('flex flex-col items-center w-full')}>
            <Input
              {...form.register('privateKey', {
                required: 'Empty input is not allowed',
                validate: (value) => {
                  // prviate key should be 64 characters long
                  if (value.length !== 64) {
                    return 'Invalid private key';
                  }
                },
              })}
              className="flex-1 w-full"
              elClassName={'w-full h-[154px]'}
              type={'password'}
              state={getInputStateByFormState(form.formState, 'privateKey')}
              placeholder={`Paste your private key here`}
            />

            {errors?.privateKey && (
              <Typo.Hints className="text-red-500 w-full">
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

export default ImportPrivateKeyView;
