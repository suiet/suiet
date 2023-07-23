import { PageWithNavLayout } from '../../layouts/PageWithNavLayout';
import { AssetChangeFormatter, formatGasBudget } from '@suiet/core';
import { ObjectChangeItem } from '../../components/AssetChange';
import useMyAssetChangesFromDryRun from '../dapp/TxApprovePage/hooks/useMyAssetChangesFromDryRun';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { TransactionBlock } from '@mysten/sui.js';
import { ReactNode, useMemo, useState } from 'react';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import Button from '../../components/Button';
import WalletSelector from '../dapp/WalletSelector';
import { LoadingSpin } from '../../components/Loading';
import { useNetwork } from '../../hooks/useNetwork';
import Drawer from '../../components/Drawer';

export type AssetChangeConfirmPageProps = {
  serializedTransactionBlock: string | null | undefined;
  open: boolean;
  onClose?: () => void;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

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

  const transactionBlock = useMemo(() => {
    if (!props.serializedTransactionBlock) {
      return undefined;
    }
    return TransactionBlock.from(props.serializedTransactionBlock);
  }, [props.serializedTransactionBlock]);

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
        <div className={'h-full flex justify-center items-center'}>
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

  const handleClose = (confirmed: boolean) => {
    if (confirmed) {
      props.onOk && props.onOk();
    } else {
      props.onCancel && props.onCancel();
    }
    props.onClose && props.onClose();
  };

  return (
    <Drawer
      title={'Confirm Transaction'}
      open={props.open}
      onClose={() => handleClose(false)}
    >
      <main className={'mb-[40px] flex-1'}>
        <WalletSelector className={'mx-[32px] mt-[10px]'} />
        {renderAssetChanges()}
      </main>
      <footer
        className={
          'sticky bottom-0 w-full px-4 py-2 flex border-t z-10 bg-white'
        }
      >
        <Button state={'danger'} onClick={() => handleClose(false)}>
          {cancelText}
        </Button>
        <Button
          state={'primary'}
          className={'ml-[8px]'}
          onClick={() => handleClose(true)}
        >
          {okText}
        </Button>
      </footer>
    </Drawer>
  );
};

export default AssetChangeConfirmPage;
