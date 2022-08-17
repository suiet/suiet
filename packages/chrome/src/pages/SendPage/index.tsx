import classnames from 'classnames';
import React, {useState} from 'react';
import {Extendable} from '../../types';
import styles from './index.module.scss';
import Textarea from "../../components/Textarea";
import {InputGroup} from "../../components/Input";
import IconWaterDrop from "../../assets/icons/waterdrop.svg";
import TokenIcon from "../../components/TokenIcon";
import Typo from '../../components/Typo';
import Divider from "../../components/Divider";
import Button from "../../components/Button";

const Hints = (props: Extendable & { state?: 'error' }) => {
  const {state = 'error', ...restProps} = props;
  return (
    <small
      {...restProps}
      className={classnames(
        styles['hints'],
        state ? styles[`hints--${state}`] : '',
        props.className
      )}>this is not a validate address
    </small>
  )
}

const WaterDropIcon = () => {
  return (
    <TokenIcon
      icon={IconWaterDrop}
      size={'small'}
      alt="water-drop"
    />
  )
}

const SendPage = () => {
  const [address, setAddress] = useState<{
    state: 'default' | 'success' | 'error';
    errMsg: string;
  }>({
    state: 'default',
    errMsg: '',
    // state: 'error',
    // errMsg: 'this is not a validate address',
  });

  return (
    <div className={styles['container']}>
      <section className={styles['section']}>
        <Typo.Title>Address</Typo.Title>
        <div className={'mt-[6px]'}>
          <Textarea
            state={address.state}
            placeholder="Enter SUI address"
          />
          {address.errMsg && (
            <Hints className={'mt-[6px]'}>{address.errMsg}</Hints>
          )}
        </div>
      </section>

      <section className={classnames(styles['section'], 'mt-[20px]')}>
        <Typo.Title>Amount</Typo.Title>
        <div className={'mt-[6px]'}>
          <InputGroup
            state={'default'}
            placeholder={'Please enter the amount'}
            suffix={(
              <div className={styles['input-suffix']}>
                <WaterDropIcon />
                <Typo.Normal className={'ml-[8px]'}>SUI</Typo.Normal>
              </div>
            )}
          />
          <Typo.Small className={'mt-[6px]'}>≈ 12 USD</Typo.Small>
        </div>
      </section>

      <section className={styles['section']}>
        <Divider type={'horizontal'} />
        <Typo.Title>Gas fee</Typo.Title>
        <div className={'flex items-center'}>
          <WaterDropIcon />
          <Typo.Normal className={'ml-[6px]'}>0.0012 SUI ≈ 12 USD</Typo.Normal>
        </div>

        <Button state={'primary'} className={'mt-[20px]'}>Send</Button>
        <Button className={'mt-[10px]'}>Cancel</Button>
      </section>
    </div>
  )
}

export default SendPage;