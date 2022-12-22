import NftList from '../NFTPage/NftList';
import Typo from '../../components/Typo';
import styles from './index.module.scss';
import message from '../../components/message';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import { isNonEmptyArray } from '../../utils/check';
import Empty from './NftList/Empty';
import { MintNftParams } from '@suiet/core';
import { sleep } from '../../utils/time';
import AppLayout from '../../layouts/AppLayout';
import { CoinSymbol, useCoinBalance } from '../../hooks/useCoinBalance';
import { useApiClient } from '../../hooks/useApiClient';
import { OmitToken } from '../../types';
import { useNetwork } from '../../hooks/useNetwork';
import { useState } from 'react';
import { ReactComponent as GiftIcon } from '../../assets/icons/gift.svg';
import { useMintNftCampaign } from './hooks/useMintNftCampaign';

function MainPage() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const {
    data: nftList,
    loading,
    mutate: refreshNftList,
  } = useNftList(address, appContext.networkId);

  const apiClient = useApiClient();
  const { data: network } = useNetwork(appContext.networkId);
  const [sendLoading, setSendLoading] = useState(false);

  const { balance, loading: balanceLoading } = useCoinBalance(
    CoinSymbol.SUI,
    address,
    appContext.networkId
  );
  const mintNftCampaign = useMintNftCampaign();

  async function mintSampleNFT() {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    if (balanceLoading || Number(balance) < 10000) {
      message.error('Please ensure you have more than 0.00001 SUI to mint');
      return;
    }
    setSendLoading(true);
    try {
      await apiClient.callFunc<OmitToken<MintNftParams>, undefined>(
        'txn.mintExampleNft',
        {
          metadata: mintNftCampaign,
          network,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
        { withAuth: true }
      );
      message.success('Mint NFT succeeded');
    } catch (e: any) {
      message.error(`Mint NFT failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
    }
  }

  function renderContent() {
    if (!loading && !isNonEmptyArray(nftList))
      return (
        <Empty
          onMintSuccess={async () => {
            await refreshNftList();
            await sleep(1000);
            await refreshNftList();
            await sleep(1000);
            await refreshNftList();
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
            {network?.name !== 'mainnet' && (
              <Button
                className="rounded-full w-fit"
                onClick={mintSampleNFT}
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
            value={['', '', '', ''] as any}
            className={styles['nft-list']}
          />
        ) : (
          <NftList value={nftList ?? []} className={styles['nft-list']} />
        )}
      </div>
    );
  }

  return <AppLayout>{renderContent()}</AppLayout>;
}

export default MainPage;
