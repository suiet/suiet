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

export type NftListProps = StyleExtendable;

type NftItemProps = Extendable & {
  id: string;
  name: string;
  description: string;
  url: string;
};

const NftItem = (props: NftItemProps) => {
  return (
    <div className={styles['token-item']}>
      <div className="flex items-center">
        <img
          className={styles['icon-wrap']}
          src={nftImgUrl(props.url)}
          alt={props.name}
        />
        <div className={classnames(styles['nft-meta'], 'ml-[32px]')}>
          <Typo.Normal className={classnames(styles['nft-name'])}>
            {props.name}
          </Typo.Normal>
          <Typo.Small className={classnames(styles['nft-description'])}>
            {props.description}
          </Typo.Small>
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
    return coreApi.txn.getOwnedNfts(network, address);
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

  if (!nftList) return null;
  return (
    <div className={classnames(props.className)} style={props.style}>
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
