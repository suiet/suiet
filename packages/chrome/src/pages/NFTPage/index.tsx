import NftList from '../NFTPage/NftList';
import Typo from '../../components/Typo';
import styles from './index.module.scss';

function MainPage() {
  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <Typo.Title className={styles['title']}>NFT</Typo.Title>
        <Typo.Small className={styles['desc']}>Manage your NFTs.</Typo.Small>
      </header>
      <NftList className={styles['nft-list']} />
    </div>
  );
}

export default MainPage;
