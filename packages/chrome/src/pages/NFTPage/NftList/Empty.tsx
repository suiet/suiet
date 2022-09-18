import Button from '../../../components/Button';
import message from '../../../components/message';
import { MintNftParams } from '@suiet/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { useAccount } from '../../../hooks/useAccount';
import { useState } from 'react';
import styles from './empty.module.scss';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import { useApiClient } from '../../../hooks/useApiClient';

export type EmptyProps = {
  onMintSuccess: () => void;
};

export default function Empty(props: EmptyProps) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const [sendLoading, setSendLoading] = useState(false);
  const { data: account } = useAccount(appContext.accountId);

  const { balance, loading: balanceLoading } = useCoinBalance(
    account?.address ?? '',
    CoinSymbol.SUI,
    {
      networkId: appContext.networkId,
    }
  );

  async function mintSampleNFT() {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    const params = {
      network,
      walletId: appContext.walletId,
      accountId: appContext.accountId,
      token: appContext.token,
    };

    if (balanceLoading || Number(balance) < 10000) {
      message.error('Please ensure you have more than 10000 SUI to mint');
      return;
    }
    setSendLoading(true);
    try {
      await apiClient.callFunc<MintNftParams, undefined>(
        'txn.mintExampleNft',
        params
      );
      message.success('Mint NFT succeed');
      props.onMintSuccess();
    } catch (e: any) {
      message.error(`Mint NFT failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
      console.log('mint nft');
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mx-8">
      <div className={styles['img']} />
      <div className={styles['title']}>No NFT in your wallet</div>
      <div className={styles['description']}>
        You will see your NFT here once you have one.
        <br />
        <a
          href="https://suiet.app/docs/getting-started"
          className="text-sky-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          Get Sui first
        </a>{' '}
        to get start your journey
        <Button
          onClick={mintSampleNFT}
          loading={sendLoading}
          style={{ marginTop: '18px' }}
        >
          Mint NFT
        </Button>
      </div>
    </div>
  );
}
