import { PageWithNavLayout } from '../../layouts/PageWithNavLayout';
import { AssetChangeFormatter, formatGasBudget } from '@suiet/core';
import { ObjectChangeItem } from '../../components/AssetChange';
import useMyAssetChangesFromDryRun from '../dapp/TxApprovePage/hooks/useMyAssetChangesFromDryRun';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { TransactionBlock } from '@mysten/sui.js';
import { ReactNode, useMemo } from 'react';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import Button from '../../components/Button';
import WalletSelector from '../dapp/WalletSelector';
import { useNavigate } from 'react-router-dom';
import { LoadingSpin } from '../../components/Loading';
import { useNetwork } from '../../hooks/useNetwork';

export type AssetChangeConfirmPageProps = {
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const clutchyNftPurchaseTxbData =
  '{"version":1,"gasConfig":{"budget":"80000000"},"inputs":[{"kind":"Input","value":69000000000,"index":0,"type":"pure"},{"kind":"Input","value":3381000000,"index":1,"type":"pure"},{"kind":"Input","value":"0x266f5a401df5fa40fc5ab2a1a8e74ac41fe5fb241e106eb608bf37c732c17e0e","index":2,"type":"object"},{"kind":"Input","value":"0xf37aef913cbd5f8399514d4aa6baf2b48af427d67b82723f18aff93cfebacea0","index":3,"type":"object"},{"kind":"Input","value":"0x71e317e2f77bfe72c1b012506796bd0c55fd4bb55ca56152c23e325e10d0bf58","index":4,"type":"object"},{"kind":"Input","value":"0x89c3acb80f578f5bbb05b005421bca0ac16715d1694f8f3f18f45c95d9508ee1","index":5,"type":"object"},{"kind":"Input","value":"69000000000","index":6,"type":"pure"},{"kind":"Input","value":"0x1ae174e8e2f238648d5fbef41e2b435b7285e678aa5e2e7db27f1be006ab242c","index":7,"type":"object"},{"kind":"Input","value":"0xb648cec3bca1895fe8d480c6f0783a70d3f88790d79ce42a0fec3199934f9b1c","index":8,"type":"object"},{"kind":"Input","value":"0xbee1cdd31138d62f7c4e1dec71a49c89ddfddabf219b0e1e13b4845770d05074","index":9,"type":"object"},{"kind":"Input","value":"0x9f662eafdf9b4327c9836f3f3a46cd2b43f23978061121c7796be647de05129b","index":10,"type":"pure"},{"kind":"Input","value":"0x2795dbc73f09d0ac8640696e286ebca5d630df022b1c763b35fcbd8504da7eef","index":11,"type":"pure"}],"transactions":[{"kind":"SplitCoins","coin":{"kind":"GasCoin"},"amounts":[{"kind":"Input","value":69000000000,"index":0,"type":"pure"},{"kind":"Input","value":3381000000,"index":1,"type":"pure"}]},{"kind":"MoveCall","target":"0xa0bab69d913e5a0ce8b448235a08bcf4c42da45c50622743dc9cab2dc0dff30f::orderbook::buy_nft","arguments":[{"kind":"Input","value":"0x266f5a401df5fa40fc5ab2a1a8e74ac41fe5fb241e106eb608bf37c732c17e0e","index":2,"type":"object"},{"kind":"Input","value":"0xf37aef913cbd5f8399514d4aa6baf2b48af427d67b82723f18aff93cfebacea0","index":3,"type":"object"},{"kind":"Input","value":"0x71e317e2f77bfe72c1b012506796bd0c55fd4bb55ca56152c23e325e10d0bf58","index":4,"type":"object"},{"kind":"Input","value":"0x89c3acb80f578f5bbb05b005421bca0ac16715d1694f8f3f18f45c95d9508ee1","index":5,"type":"object"},{"kind":"Input","value":"69000000000","index":6,"type":"pure"},{"kind":"NestedResult","index":0,"resultIndex":0}],"typeArguments":["0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies","0x2::sui::SUI"]},{"kind":"MoveCall","target":"0x34a2d6af89db8a7d702cfd257f89da8d7b3462fd871ac2eb52b76d02eae2c82c::transfer_allowlist::confirm_transfer","arguments":[{"kind":"Input","value":"0x1ae174e8e2f238648d5fbef41e2b435b7285e678aa5e2e7db27f1be006ab242c","index":7,"type":"object"},{"kind":"Result","index":1}],"typeArguments":["0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies"]},{"kind":"MoveCall","target":"0x34a2d6af89db8a7d702cfd257f89da8d7b3462fd871ac2eb52b76d02eae2c82c::royalty_strategy_bps::confirm_transfer","arguments":[{"kind":"Input","value":"0xb648cec3bca1895fe8d480c6f0783a70d3f88790d79ce42a0fec3199934f9b1c","index":8,"type":"object"},{"kind":"Result","index":1}],"typeArguments":["0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies","0x2::sui::SUI"]},{"kind":"MoveCall","target":"0xb2b8d1c3fd2b5e3a95389cfcf6f8bda82c88b228dff1f0e1b76a63376cbad7c6::transfer_request::confirm","arguments":[{"kind":"Result","index":1},{"kind":"Input","value":"0xbee1cdd31138d62f7c4e1dec71a49c89ddfddabf219b0e1e13b4845770d05074","index":9,"type":"object"}],"typeArguments":["0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies","0x2::sui::SUI"]},{"kind":"TransferObjects","objects":[{"kind":"NestedResult","index":0,"resultIndex":0}],"address":{"kind":"Input","value":"0x9f662eafdf9b4327c9836f3f3a46cd2b43f23978061121c7796be647de05129b","index":10,"type":"pure"}},{"kind":"TransferObjects","objects":[{"kind":"NestedResult","index":0,"resultIndex":1}],"address":{"kind":"Input","value":"0x2795dbc73f09d0ac8640696e286ebca5d630df022b1c763b35fcbd8504da7eef","index":11,"type":"pure"}}]}';

function TxItem(props: { name: ReactNode; value: ReactNode }) {
  return (
    <div className={styles['detail-item']}>
      <Typo.Normal className={styles['detail-item__key']}>
        {props.name}
      </Typo.Normal>
      {typeof props.value === 'string' ? (
        <Typo.Normal className={styles['detail-item__value']}>
          {props.value}
        </Typo.Normal>
      ) : (
        <div className={styles['detail-item__value']}>{props.value}</div>
      )}
    </div>
  );
}

const AssetChangeConfirmPage = (props: AssetChangeConfirmPageProps) => {
  const { okText = 'Confirm', cancelText = 'Cancel' } = props;
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: account } = useAccount(appContext.accountId);
  const { data: network } = useNetwork(appContext.networkId);
  const navigate = useNavigate();

  const transactionBlock = useMemo(
    () => TransactionBlock.from(clutchyNftPurchaseTxbData),
    []
  );

  const {
    data: { coinChangeList, nftChangeList, objectChangeList, gasBudget },
    error: diffError,
    loading: diffLoading,
  } = useMyAssetChangesFromDryRun(account?.address, transactionBlock);

  function renderOverviewInfo() {
    return (
      <div className={'mt-[16px] py-[16px] border-t'}>
        <TxItem
          name={'Gas Budget'}
          value={`${formatGasBudget(gasBudget)} SUI`}
        />
        <TxItem name={'Network'} value={network.name} />
      </div>
    );
  }

  const renderAssetChanges = () => {
    if (diffLoading) {
      return (
        <div className={'h-full flex justify-center items-center mt-[80px]'}>
          <LoadingSpin />
        </div>
      );
    }
    return (
      <div className={'px-[32px]'}>
        <div className="my-6 flex flex-col gap-2">
          {[...coinChangeList, ...nftChangeList, ...objectChangeList].map(
            (item, i) => {
              const f = AssetChangeFormatter.format(item);
              return (
                <ObjectChangeItem
                  key={item.changeType + item.objectType + i}
                  title={f.title}
                  desc={f.desc}
                  descType={'address'}
                  icon={f.icon}
                  iconShape={f.iconShape}
                  iconContainerColor={f.iconColor}
                  changeTitle={f.changeTitle}
                  changeTitleColor={f.changeTitleColor as any}
                  changeDesc={f.changeDesc}
                />
              );
            }
          )}
        </div>
        {renderOverviewInfo()}
      </div>
    );
  };

  return (
    <PageWithNavLayout
      navProps={{
        title: 'Action Confirm',
        onNavBack: () => {
          navigate(-1);
        },
      }}
    >
      <header className={'mt-[24px]'}>
        <div className={'px-[32px]'}>
          <Typo.Title className={'font-bold text-[36px]'}>
            Asset Changes
          </Typo.Title>
          <Typo.Normal>Please confirm your action</Typo.Normal>
        </div>
      </header>

      <main className={'mb-[80px] mt-[24px]'}>
        <WalletSelector className={'mx-[32px] mt-[10px]'} />
        {renderAssetChanges()}
      </main>
      <footer
        className={
          'fixed w-full bottom-0 px-4 py-2 flex border-t z-10 bg-white'
        }
      >
        <Button state={'danger'} onClick={props.onCancel}>
          {cancelText}
        </Button>
        <Button state={'primary'} className={'ml-[8px]'} onClick={props.onOk}>
          {okText}
        </Button>
      </footer>
    </PageWithNavLayout>
  );
};

export default AssetChangeConfirmPage;
