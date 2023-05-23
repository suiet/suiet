import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AddressInput from '../../../components/AddressInput';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import Typo from '../../../components/Typo';
import { getInputStateByFormState } from '../../../utils/form';
import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import { SendData } from '../types';
import { ReactComponent as ViewIcon } from '../../../assets/icons/view.svg';
import classNames from 'classnames';
import useTransactionList from '../hooks/useTransactionList';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface AddressInputValues {
  address: string;
}

function AddressInputPage({
  onNext,
  onSubmit,
  state,
}: {
  onNext: () => void;
  onSubmit: (address: string) => void;
  state: SendData;
}) {
  const form = useForm<AddressInputValues>({
    mode: 'onChange',
    defaultValues: {
      address: state.recipientAddress,
    },
  });
  const { networkId } = useSelector((state: RootState) => state.appContext);
  const addressState = getInputStateByFormState(form.formState, 'address');
  const formAddress = form.getValues().address;
  const { getTransactionList, data, loading } = useTransactionList();
  useWatch({ name: 'address', control: form.control });
  const disabled =
    addressState === 'error' ||
    (state.recipientAddress === '' && addressState === 'default');

  let history = null;
  if (data) {
    history = data;
  }

  useEffect(() => {
    if (formAddress) {
      getTransactionList({
        variables: {
          fromAddress: formAddress,
          toAddress: formAddress,
          startTime: dayjs().subtract(7, 'd').valueOf(),
          endTime: dayjs().valueOf(),
        },
      });
    }
  }, [formAddress]);

  return (
    <>
      <Form
        form={form}
        onSubmit={(data) => {
          onNext && onNext();
          onSubmit(data.address);
        }}
      >
        <div className={'px-[32px]'}>
          <Typo.Title className={'mt-[48px] font-bold text-[36px]'}>
            Input Address
          </Typo.Title>
          <Typo.Normal className={`mt-[8px] ${styles['desc']}`}>
            Enter an validate address
          </Typo.Normal>

          <AddressInput form={form} className={'mt-[48px]'} />
          {!loading &&
            history &&
            !disabled &&
            (history.length > 0 ? (
              <div className={styles['transaction-num']}>
                {history?.length} transactions in a week
                <div
                  onClick={() => {
                    window.open(
                      `https://explorer.sui.io/address/${formAddress}?network=${networkId}`,
                      '_blank'
                    );
                  }}
                  className={styles['view-btn']}
                >
                  view <ViewIcon />
                </div>
              </div>
            ) : (
              <div
                className={classNames(
                  styles['transaction-num'],
                  styles['warn']
                )}
              >
                <div className={styles['warn-btn']}>Warn</div>
                <div className={styles['warn-desc']}>
                  No recent transactions
                </div>
              </div>
            ))}
        </div>

        <div className={commonStyles['next-step']}>
          <Button type={'submit'} state={'primary'}>
            Next Step
          </Button>
        </div>
      </Form>
    </>
  );
}

export default AddressInputPage;
