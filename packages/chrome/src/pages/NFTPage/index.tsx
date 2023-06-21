import NftList from '../NFTPage/NftList';
import Typo from '../../components/Typo';
import styles from './index.module.scss';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import { isNonEmptyArray } from '../../utils/check';
import Empty from './NftList/Empty';
import {
  getMintExampleNftTxBlock,
  SendAndExecuteTxParams,
  TxEssentials,
} from '@suiet/core';
import { sleep } from '../../utils/time';
import AppLayout from '../../layouts/AppLayout';
import { useApiClient } from '../../hooks/useApiClient';
import { OmitToken } from '../../types';
import { useNetwork } from '../../hooks/useNetwork';
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as GiftIcon } from '../../assets/icons/gift.svg';
import Message from '../../components/message';
import { useFeatureFlagsWithNetwork } from '../../hooks/useFeatureFlags';
import useSuiBalance from '../../hooks/coin/useSuiBalance';

function MainPage() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const {
    data: nftList,
    refetch: refetchNftList,
    loading,
    error,
  } = useNftList(address, {
    pollInterval: 5 * 1000,
  });

  const apiClient = useApiClient();
  const { data: network } = useNetwork(appContext.networkId);
  const [sendLoading, setSendLoading] = useState(false);
  const featureFlags = useFeatureFlagsWithNetwork();

  const { data: suiBalance, loading: balanceLoading } = useSuiBalance(address);

  const mintSampleNFT = useCallback(async () => {
    if (!network) throw new Error('require network selected');
    if (!featureFlags?.sample_nft_object_id) {
      throw new Error('missing sample NFT packageId');
    }
    if (balanceLoading || BigInt(suiBalance.balance) < 6 * 10 ** 8) {
      Message.error('Please ensure you have more than 0.6 SUI to mint');
      return;
    }
    const tx = getMintExampleNftTxBlock(featureFlags.sample_nft_object_id);
    await apiClient.callFunc<
      SendAndExecuteTxParams<string, OmitToken<TxEssentials>>,
      undefined
    >(
      'txn.signAndExecuteTransactionBlock',
      {
        transactionBlock: tx.serialize(),
        context: {
          network,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
      },
      { withAuth: true }
    );
    Message.success('Mint succeeded');
  }, [
    featureFlags?.sample_nft_object_id,
    appContext,
    balanceLoading,
    suiBalance,
    network,
  ]);

  const handleMintSampleNFT = useCallback(async () => {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    setSendLoading(true);
    try {
      await mintSampleNFT();
    } catch (e: any) {
      Message.error(`Mint NFT failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
    }
  }, [mintSampleNFT]);

  function renderContent() {
    if (!loading && !isNonEmptyArray(nftList))
      return (
        <Empty
          mintSampleNFT={mintSampleNFT}
          onMintSuccess={async () => {
            await sleep(2 * 1000);
            await refetchNftList();
          }}
        />
      );
    return (
      <div className={styles['container']}>
        <header className={styles['header']}>
          <div className="flex items-center justify-between">
            <div className="">
              <Typo.Title className={styles['title']}>NFT</Typo.Title>
              <Typo.Small className={styles['desc']}>
                Manage your NFTs.
              </Typo.Small>
            </div>
            {network?.enableMintExampleNFT && (
              <Button
                className="rounded-full w-fit"
                onClick={handleMintSampleNFT}
                loading={sendLoading}
              >
                {!sendLoading && (
                  <GiftIcon
                    style={{
                      stroke: '#B9C0D4',
                    }}
                  />
                )}
              </Button>
            )}
          </div>
        </header>
        {loading ? (
          // skeleton
          <NftList
            loading={true}
            value={[{}, {}, {}, {}] as any}
            className={styles['nft-list']}
          />
        ) : (
          <NftList value={nftList ?? []} className={styles['nft-list']} />
        )}
      </div>
    );
  }

  useEffect(() => {
    if (!error) return;
    Message.error(error.message);
  }, [error]);

  return <AppLayout>{renderContent()}</AppLayout>;
}

export default MainPage;
