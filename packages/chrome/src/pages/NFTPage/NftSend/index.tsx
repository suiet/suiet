import { TransferObjectParams } from '@suiet/core';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressInput from '../../../components/AddressInput';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import message from '../../../components/message';
import Nav from '../../../components/Nav';
import NftImg from '../../../components/NftImg';
import Typo from '../../../components/Typo';
import { useApiClient } from '../../../hooks/useApiClient';
import { useNetwork } from '../../../hooks/useNetwork';
import { RootState } from '../../../store';
import { OmitToken } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import styles from './index.module.scss';

interface SendFormValues {
  address: string;
}

const GAS_BUDGET = 100;

export default function SendNft() {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [sendLoading, setSendLoading] = useState(false);
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const {
    id = '',
    name = '',
    description = '',
    previousTransaction = '',
    objectType = '',
    url = '',
    hasPublicTransfer = false,
  } = location.state || ({} as any);

  const form = useForm<SendFormValues>({
    mode: 'onChange',
    defaultValues: {
      address: '',
    },
  });

  useEffect(() => {
    if (!id) throw new Error('id should be passed within location state');
  }, [id]);

  async function submitNftTransaction(data: SendFormValues) {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    setSendLoading(true);
    try {
      message.success('Send succeeded');
      await apiClient.callFunc<OmitToken<TransferObjectParams>, undefined>(
        'txn.transferObject',
        {
          network,
          recipient: data.address,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
          objectId: id,
        },
        { withAuth: true }
      );
      navigate('/transaction/flow');
    } catch (e: any) {
      console.error(e);
      message.error(`Send failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
    }
  }

  return (
    <div className="pb-16">
      <Nav
        title={'NFT Details'}
        onNavBack={() => {
          navigate('/nft/details', {
            state: {
              id,
              name,
              description,
              previousTransaction,
              objectType,
              url,
              hasPublicTransfer,
            },
          });
        }}
      />
      <div className={styles['title-container']}>
        <div className={styles['title']}>Send NFT</div>
        <div className={styles['description']}>Send your NFT to others</div>
      </div>
      <div className={classNames(styles['nft-bg'], 'flex')}>
        <NftImg src={url} alt={name} className={styles['nft-img']} />
        <div className={styles['nft-content']}>
          <Typo.Title className={styles['nft-name']}>{name}</Typo.Title>
          <Typo.Normal className={styles['nft-desc']}>
            {description}
          </Typo.Normal>
        </div>
      </div>
      <Form form={form} onSubmit={submitNftTransaction}>
        <div className={styles['address-container']}>
          <Typo.Title className={styles['address']}>Address</Typo.Title>
          <AddressInput form={form} className={'mt-[6px]'} />
        </div>
        <div className={styles['gas-container']}>
          <Typo.Title className={styles['gas']}>Gas Fee</Typo.Title>
          <Typo.Normal className={styles['gas-amount']}>
            {formatCurrency(GAS_BUDGET)} SUI
          </Typo.Normal>
        </div>
        <div className={styles['btn-container']}>
          <Button type={'submit'} state={'primary'} loading={sendLoading}>
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
}
