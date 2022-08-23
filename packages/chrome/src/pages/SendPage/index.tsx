import classnames from 'classnames';
import React from 'react';
import {Extendable} from '../../types';
import styles from './index.module.scss';
import Textarea from "../../components/Textarea";
import {InputGroup} from "../../components/Input";
import Typo from '../../components/Typo';
import Divider from "../../components/Divider";
import Button from "../../components/Button";
import {useNavigate} from "react-router-dom";
import WaterDropIcon from "../../components/WaterDropIcon";
import {isValidSuiAddress} from "@mysten/sui.js";
import {useForm} from "react-hook-form";
import {ErrorMessage} from '@hookform/error-message';
import toast from "../../components/toast";

const Hints = (props: Extendable & { state?: 'default' | 'error' }) => {
  const {state = 'default', ...restProps} = props;
  return (
    <small
      {...restProps}
      className={classnames(
        styles['hints'],
        state ? styles[`hints--${state}`] : '',
        props.className
      )}>
    </small>
  )
}

interface SendFormValues {
  address: string;
  amount: number;
}

const SendPage = () => {
  const navi = useNavigate();

  const {
    register,
    handleSubmit,
    formState,
  } = useForm<SendFormValues>({
    mode: 'onChange',
    defaultValues: {
      address: '',
      amount: 0,
    }
  });

  function submitTransaction(data: SendFormValues) {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    console.log('submit', data)
    toast.success('Sent Success');
  }

  return (
    <div className={styles['container']}>
      <form
        onSubmit={handleSubmit(submitTransaction)}
      >
        <section className={styles['section']}>
          <Typo.Title>Address</Typo.Title>
          <div className={'mt-[6px]'}>
            <Textarea
              placeholder="Enter SUI address"
              state={formState.errors['address'] ? 'error' : (
                formState.dirtyFields['address']
                  ? 'success' : 'default'
              )}
              {...register(
                'address', {
                  required: 'address should not be empty',
                  validate: (val) => {
                    return isValidSuiAddress(val) || 'this is not a valid address';
                  }
                }
              )}
            />
            {/*<Hints className={'mt-[6px]'}>{'23 transactions in 1 week, view in explorer'}</Hints>*/}
            <ErrorMessage
              errors={formState.errors}
              name={'address'}
              render={(error) => (
                <Hints state={'error'} className={'mt-[6px]'}>{error.message}</Hints>
              )}
            />
          </div>
        </section>

        <section className={classnames(styles['section'], 'mt-[20px]')}>
          <Typo.Title>Amount</Typo.Title>
          <div className={'mt-[6px]'}>
            <InputGroup
              type={'number'}
              state={formState.errors['amount'] ? 'error' : (
                formState.dirtyFields['amount']
                 ? 'success' : 'default'
              )}
              placeholder={'Please enter the amount'}
              suffix={(
                <div className={styles['input-suffix']}>
                  <WaterDropIcon size={'small'}/>
                  <Typo.Normal className={'ml-[8px]'}>SUI</Typo.Normal>
                </div>
              )}
              {...register(
                'amount', {
                  required: 'amount should not be empty',
                  valueAsNumber: true,
                  validate: (val) => {
                    return val > 0 || 'amount should be greater than 0';
                  },
                }
              )}
            />
            <ErrorMessage
              errors={formState.errors}
              name={'amount'}
              render={(error) => (
                <Hints state={'error'} className={'mt-[6px]'}>{error.message}</Hints>
              )}
            />
            <Typo.Small className={'mt-[6px]'}>≈ 12 USD</Typo.Small>
          </div>
        </section>

        <section className={styles['section']}>
          <Divider type={'horizontal'}/>
          <Typo.Title>Gas fee</Typo.Title>
          <div className={'flex items-center'}>
            <WaterDropIcon size={'small'}/>
            <Typo.Normal className={'ml-[6px]'}>0.0012 SUI ≈ 12 USD</Typo.Normal>
          </div>

          <Button type={'submit'} state={'primary'} className={'mt-[20px]'}>Send</Button>
          <Button
            className={'mt-[10px]'}
            onClick={() => {navi('/')}}
          >Cancel</Button>
        </section>
      </form>

    </div>
  )
}

export default SendPage;