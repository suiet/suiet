import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import useSWR from 'swr';
import { coreApi } from '@suiet/core';
import { useNetwork } from '../../../hooks/useNetwork';
import { Network } from '@suiet/core/dist/api/network';
import { swrLoading } from '../../../utils/others';
import { nftImgUrl } from '../../../utils/nft';
import Empty from './Empty';

export type NftListProps = StyleExtendable;

type NftItemProps = Extendable & {
  id: string;
  name: string;
  description: string;
  url: string;
};

const NftItem = (props: NftItemProps) => {
  return (
    <div className={classnames('mb-4')}>
      <div
        className={classnames(
          'flex',
          'flex-col',
          'items-center',
          'max-w-[160px]',
          'border',
          'border-gray-300',
          'rounded-xl',
          'p-2',
          'transition',
          'hover:bg-gray-100'
        )}
      >
        <img
          className={styles['nft-img']}
          src={nftImgUrl(props.url)}
          alt={props.name}
        />
        <div className={classnames('w-full', 'mt-2')}>
          <Typo.Normal className={classnames(styles['nft-name'])}>
            {props.name}
          </Typo.Normal>
        </div>
      </div>
    </div>
  );
};

function useNftList(address: string, networkId: string = 'devnet') {
  const { data: network } = useNetwork(networkId);
  const { data, error } = useSWR(
    ['getOwnedNfts', network, address],
    fetchNftList
  );

  console.log('NftList', data);

  async function fetchNftList(_: string, network: Network, address: string) {
    if (!network || !address) return;
    return await coreApi.txn.getOwnedNfts(network, address);
  }

  return {
    data,
    error,
    loading: swrLoading(data, error),
  };
}

const NftList = (props: NftListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { account } = useAccount(appContext.accountId);
  const { data: nftList } = useNftList(account.address, appContext.networkId);

  if (!nftList || nftList.length === 0) return <Empty />;
  return (
    <div
      className={classnames(
        props.className,
        'grid',
        'grid-cols-2',
        'justify-items-center'
      )}
      style={props.style}
    >
      {nftList.map((nft) => {
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
