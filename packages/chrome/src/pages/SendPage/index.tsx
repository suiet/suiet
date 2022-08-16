import classnames from 'classnames';
import React, {useState} from 'react';
import {Extendable} from '../../types';
import styles from './index.module.scss';
import Textarea from "../../components/Textarea";
import {InputGroup} from "../../components/Input";
import IconWaterDrop from "../../assets/icons/waterdrop.svg";
import TokenIcon from "../../components/TokenIcon";
import {Title, Normal} from '../../components/Typo';

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
        <Title>Address</Title>
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
        <Title>Amount</Title>
        <div className={'mt-[6px]'}>
          <InputGroup
            state={'default'}
            placeholder={'Please enter the amount'}
            suffix={(
              <div className={styles['input-suffix']}>
                <TokenIcon
                  icon={IconWaterDrop}
                  size={'small'}
                  alt="water-drop"
                />
                <Normal className={'ml-[8px]'}>SUI</Normal>
              </div>
            )}
          />
          <span>≈ 12 USD</span>
        </div>
      </section>

      <div></div>

      <section className={styles['section']}>
        <Title>Gas fee</Title>
        <div>
          <img src="" alt="sui"/>
        </div>
        <span>0.0012 SUI ≈ 12 USD</span>

        <button>Send</button>
        <button>Cancel</button>
      </section>
    </div>
  )
}

export default SendPage;