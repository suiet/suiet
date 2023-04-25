import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { nftImgUrl } from '../../../utils/nft';
import { useNavigate } from 'react-router-dom';
import NftImg from '../../../components/NftImg';
import Skeleton from 'react-loading-skeleton';
import { NftGqlDto } from '../../../hooks/useNftList';

export type NftListProps = StyleExtendable & {
  value: NftGqlDto[];
  loading?: boolean;
};

export interface NftMeta {
  id: string;
  name: string;
  description: string;
  previousTransaction: string | undefined;
  url: string;
  objectType: string;
  thumbnailUrl: string | null;
  expiresAt: number | null;
  hasPublicTransfer: boolean;
}

type NftItemProps = Extendable &
  NftMeta & {
    loading?: boolean;
    onClick?: (data: NftMeta) => void;
  };

const NftItem = (props: NftItemProps) => {
  const {
    loading = false,
    id = '',
    name = 'No Name',
    description = 'No Description',
    previousTransaction = '',
    objectType = '',
    thumbnailUrl,
    expiresAt,
    url = '',
    hasPublicTransfer = false,
  } = props;
  return (
    <div
      className={classnames(styles['nft-item'], props.className)}
      onClick={() => {
        props.onClick?.({
          id,
          name,
          description,
          previousTransaction,
          objectType,
          thumbnailUrl,
          expiresAt,
          url,
          hasPublicTransfer,
        });
      }}
    >
      {loading ? (
        <Skeleton className={'w-[140px] h-[140px] rounded-[16px]'} />
      ) : (
        <NftImg src={url} thumbnailUrl={thumbnailUrl} alt={name} />
      )}
      <div className={classnames('w-full', 'mt-2')}>
        {loading ? (
          <Skeleton className={'w-[80px] h-[16px]'} />
        ) : (
          <div className="ml-1">
            <Typo.Normal className={classnames(styles['nft-name'])}>
              {name}
            </Typo.Normal>
            <Typo.Small className={classnames(styles['nft-description'])}>
              {description}
            </Typo.Small>
          </div>
        )}
      </div>
    </div>
  );
};

const NftList = (props: NftListProps) => {
  const { value: nftList = [], loading = false } = props;
  const navigate = useNavigate();
  function handleClickNft(data: NftMeta) {
    navigate(`/nft/details`, {
      state: {
        hideAppLayout: true,
        ...data,
      },
    });
  }

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
      {nftList.map((nft, index) => {
        if (loading) {
          return (
            <NftItem
              key={index}
              loading={true}
              id={''}
              name={''}
              description={''}
              previousTransaction={undefined}
              url={''}
              objectType={''}
              hasPublicTransfer={false}
            />
          );
        }
        return (
          <NftItem
            key={nft.object.objectID}
            id={nft.object.objectID}
            name={nft.name}
            url={nft.url}
            description={nft.description}
            thumbnailUrl={nft.thumbnailUrl}
            expiresAt={nft.expiresAt}
            previousTransaction={nft.object.previousTransaction}
            objectType={nft.object.type}
            hasPublicTransfer={nft.object.hasPublicTransfer}
            onClick={handleClickNft}
          />
        );
      })}
    </div>
  );
};

export default NftList;
