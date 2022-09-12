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
import { useNavigate } from 'react-router-dom';
import NftImg from '../../../components/NftImg';

export type NftListProps = StyleExtendable;

export interface NftMeta {
  id: string;
  name: string;
  description: string;
  url: string;
}

type NftItemProps = Extendable &
  NftMeta & {
    onClick?: (data: NftMeta) => void;
  };

const NftItem = (props: NftItemProps) => {
  return (
    <div
      className={classnames(styles['nft-item'], props.className)}
      onClick={() => {
        props.onClick?.({
          id: props.id,
          name: props.name,
          description: props.description,
          url: props.url,
        });
      }}
    >
      <NftImg src={nftImgUrl(props.url)} alt={props.name} />
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
  const navigate = useNavigate();

  function handleClickNft(data: NftMeta) {
    navigate(`/nft/details`, {
      state: {
        hideAppLayout: true,
        ...data,
      },
    });
  }

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
              onClick={handleClickNft}
            />
          );
        })}
    </div>
  );
};

export default NftList;
