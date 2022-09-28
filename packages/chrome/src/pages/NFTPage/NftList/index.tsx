import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { nftImgUrl } from '../../../utils/nft';
import { useNavigate } from 'react-router-dom';
import NftImg from '../../../components/NftImg';
import { NftObjectDto } from '@suiet/core';
import Skeleton from 'react-loading-skeleton';

export type NftListProps = StyleExtendable & {
  value: NftObjectDto[];
  loading?: boolean;
};

export interface NftMeta {
  id: string;
  name: string;
  description: string;
  previousTransaction: string | undefined;
  url: string;
  objectType: string;
  fields: Record<string, any>;
}

type NftItemProps = Extendable &
  NftMeta & {
    loading?: boolean;
    onClick?: (data: NftMeta) => void;
  };

const NftItem = (props: NftItemProps) => {
  const { loading = false } = props;
  return (
    <div
      className={classnames(styles['nft-item'], props.className)}
      onClick={() => {
        props.onClick?.({
          id: props.id,
          name: props.name || props.fields.metadata?.fields.name,
          description:
            props.description ||
            props.fields.metadata?.fields.description ||
            'No Description',
          previousTransaction: props.previousTransaction,
          objectType: props.objectType,
          url: props.url || props.fields.metadata?.fields.uri,
          fields: props.fields,
        });
      }}
    >
      {loading ? (
        <Skeleton className={'w-[140px] h-[140px] rounded-[16px]'} />
      ) : (
        <NftImg
          src={nftImgUrl(props.url || props.fields.metadata?.fields.uri)}
          alt={props.name || props.fields.metadata?.fields.name}
        />
      )}
      <div className={classnames('w-full', 'mt-2')}>
        {loading ? (
          <Skeleton className={'w-[80px] h-[16px]'} />
        ) : (
          <div className="ml-1">
            <Typo.Normal className={classnames(styles['nft-name'])}>
              {props.name || props.fields.metadata?.fields.name}
            </Typo.Normal>
            <Typo.Small className={classnames(styles['nft-description'])}>
              {props.description ||
                props.fields.metadata?.fields.description ||
                'No Description'}
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
        return (
          <NftItem
            key={nft.id || index}
            loading={loading}
            id={nft.id}
            name={nft.name}
            url={nft.url}
            description={nft.description}
            previousTransaction={nft.previousTransaction}
            objectType={nft.objectType}
            onClick={handleClickNft}
            fields={nft.fields}
          />
        );
      })}
    </div>
  );
};

export default NftList;
