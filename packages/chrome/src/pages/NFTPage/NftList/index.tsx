import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { nftImgUrl } from '../../../utils/nft';
import Empty from './Empty';
import { useNftList } from '../../../hooks/useNftList';

export type NftListProps = StyleExtendable;

type NftItemProps = Extendable & {
  id: string;
  name: string;
  description: string;
  url: string;
};

const NftItem = (props: NftItemProps) => {
  return (
    <div className={classnames(styles['nft-item'], props.className)}>
      <div className={styles['nft-img-wrap']}>
        <img
          className={styles['nft-img']}
          src={nftImgUrl(props.url)}
          alt={props.name}
        />
      </div>
      <div className={classnames('w-full', 'mt-2')}>
        <Typo.Normal className={classnames(styles['nft-name'])}>
          {props.name}
        </Typo.Normal>
      </div>
    </div>
  );
};

const NftList = (props: NftListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: account } = useAccount(appContext.accountId);
  const { data: nftList } = useNftList(
    account?.address ?? '',
    appContext.networkId
  );

  if (!nftList || nftList.length === 0) return <Empty />;
  return (
    <div
      className={classnames(
        props.className,
        'grid',
        'grid-cols-2',
        'gap-[8px]',
        'justify-items-center'
      )}
      style={props.style}
    >
      {nftList
        .concat(nftList)
        .concat(nftList)
        .concat(nftList)
        .map((nft) => {
          return (
            <NftItem
              key={nft.id}
              id={nft.id}
              name={nft.name}
              url={nft.url}
              description={nft.description}
            />
          );
        })}
    </div>
  );
};

export default NftList;
