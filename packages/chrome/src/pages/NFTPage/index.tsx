import NftList from '../NFTPage/NftList';
import Typo from '../../components/Typo';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import { isNonEmptyArray } from '../../utils/check';
import Empty from './NftList/Empty';
import { sleep } from '../../utils/time';

function MainPage() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: account } = useAccount(appContext.accountId);
  const {
    data: nftList,
    loading,
    mutate: refreshNftList,
  } = useNftList(account?.address ?? '', appContext.networkId);

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
        <Typo.Title className={styles['title']}>NFT</Typo.Title>
        <Typo.Small className={styles['desc']}>Manage your NFTs.</Typo.Small>
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

export default MainPage;
