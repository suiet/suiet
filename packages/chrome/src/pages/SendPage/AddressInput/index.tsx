import { useForm } from 'react-hook-form';
import AddressInput from '../../../components/AddressInput';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import Typo from '../../../components/Typo';
import { getInputStateByFormState } from '../../../utils/form';
import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import { SendData } from '../types';
import useTransactionList from '../../../hooks/useTransactionList';
import { ReactComponent as ViewIcon } from '../../../assets/icons/view.svg';
import classNames from 'classnames';

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
      address: state.address,
    },
  });
  const addressState = getInputStateByFormState(form.formState, 'address');
  const formAddress = form.getValues().address;
  const { history, loading } = useTransactionList(formAddress);

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
            Input Adress
          </Typo.Title>
          <Typo.Normal className={`mt-[8px] ${styles['desc']}`}>
            Enter and validate address
          </Typo.Normal>

          <AddressInput form={form} className={'mt-[48px]'} />
          {!loading &&
            addressState === 'success' &&
            (history && history.length > 0 ? (
              <div className={styles['transaction-num']}>
                {history?.length} transactions in 1 week
                <div
                  onClick={() => {
                    window.open(
                      `https://explorer.sui.io/address/${formAddress}`,
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
                <div className={styles['warn-btn']}>warn</div>
                no transiations in this address
              </div>
            ))}
        </div>

        <div className={commonStyles['next-step']}>
          <Button
            type={'submit'}
            state={'primary'}
            disabled={
              (state.address !== '' && addressState === 'error') ||
              (state.address === '' && addressState === 'default')
            }
          >
            Next Step
          </Button>
        </div>
      </Form>
    </>
  );
}

export default AddressInputPage;
