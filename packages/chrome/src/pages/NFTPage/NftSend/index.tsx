import { formatSUI, SendAndExecuteTxParams, TxEssentials } from '@suiet/core';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressInput from '../../../components/AddressInput';
import Button from '../../../components/Button';
import Form from '../../../components/form/Form';
import message from '../../../components/message';
import Nav from '../../../components/Nav';
import NftImg from '../../../components/NftImg';
import Typo from '../../../components/Typo';
import { useApiClient } from '../../../hooks/useApiClient';
import { useNetwork } from '../../../hooks/useNetwork';
import { RootState } from '../../../store';
import { OmitToken } from '../../../types';
import styles from './index.module.scss';
import { useForm } from 'react-hook-form';
import { NftMeta } from '../NftList';
import createTransactionNftTxb from '@suiet/core/src/utils/txb-factory/createTransferNftTxb';
import useKioskMetaLazyQuery from '../../../hooks/nft/useKioskMetaLazyQuery';
import { SuiAddress } from '@mysten/sui.js';
import useGasBudgetForNftSend from '../hooks/useGasBudgetForNftSend';
import { useWallet } from '../../../hooks/useWallet';

interface SendFormValues {
  address: string;
}

export default function SendNft() {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [sendLoading, setSendLoading] = useState(false);
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const { data: wallet, unsetPfpAvatar } = useWallet(appContext.walletId);
  const {
    objectType,
    id,
    kioskObjectId,
    kioskPackageId,
    name,
    description,
    previousTransaction,
    url,
    thumbnailUrl,
    expiresAt,
    hasPublicTransfer = false,
    verification,
  }: NftMeta = location.state || ({} as any);
  const [queryKiosk] = useKioskMetaLazyQuery();

  const form = useForm<SendFormValues>({
    mode: 'onChange',
    defaultValues: {
      address: '',
    },
  });

  const prepareTransferNftTxb = async (params: {
    objectId: string;
    recipient: string;
    objectType: string;
    senderKioskId: string | undefined;
  }) => {
    // transfer kiosk NFT
    if (params.senderKioskId) {
      // get recipient kioskId by address
      const { data } = await queryKiosk({
        variables: {
          ownerAddress: params.recipient,
        },
      });
      return createTransactionNftTxb({
        objectId: params.objectId,
        recipient: params.recipient,
        kiosk: {
          packageId: kioskPackageId ?? '0x2',
          objectType: params.objectType,
          senderId: params.senderKioskId,
          recipientId: data?.kiosk?.objectID,
        },
      });
    }
    // transfer owned NFT
    return createTransactionNftTxb({
      objectId: params.objectId,
      recipient: params.recipient,
    });
  };

  const [recipientForDryRunOnly, setRecipientForDryRunOnly] =
    useState<SuiAddress>('');
  const { data: gasBudgetResult } = useGasBudgetForNftSend({
    objectId: id,
    objectType,
    recipient: recipientForDryRunOnly,
    senderKioskId: kioskObjectId,
    prepareTransferNftTxb,
  });

  const submitNftTransaction = async (data: SendFormValues) => {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    setSendLoading(true);
    try {
      const transactionBlock = await prepareTransferNftTxb({
        objectId: id,
        objectType,
        recipient: data.address,
        senderKioskId: kioskObjectId,
      });
      transactionBlock.setGasBudget(BigInt(gasBudgetResult?.gasBudget));

      await apiClient.callFunc<
        SendAndExecuteTxParams<string, OmitToken<TxEssentials>>,
        undefined
      >(
        'txn.signAndExecuteTransactionBlock',
        {
          transactionBlock: transactionBlock.serialize(),
          context: {
            network,
            walletId: appContext.walletId,
            accountId: appContext.accountId,
          },
        },
        { withAuth: true }
      );
      message.success('Send succeeded');
    } catch (e: any) {
      console.error(e);
      message.error(`Send failed: ${e?.message}`);
      return;
    } finally {
      setSendLoading(false);
    }

    // check if this nft is set as avatar, if so, unset it
    if (wallet?.avatarPfp && wallet.avatarPfp?.objectId === id) {
      await unsetPfpAvatar();
    }
    navigate('/transaction/flow');
  };

  useEffect(() => {
    if (!id) throw new Error('id should be passed within location state');
  }, [id]);

  return (
    <div className={classNames(styles['page'], 'no-scrollbar')}>
      <Nav
        title={'Send NFT'}
        onNavBack={() => {
          navigate('/nft/details', {
            state: {
              id,
              name,
              description,
              previousTransaction,
              objectType,
              url,
              thumbnailUrl,
              expiresAt,
              hasPublicTransfer,
              verification,
            },
          });
        }}
      />
      <div className={styles['title-container']}>
        <div className={styles['title']}>Send NFT</div>
        <div className={styles['description']}>Send your NFT to others</div>
      </div>
      <div className={classNames(styles['nft-bg'], 'flex')}>
        <NftImg
          src={url}
          thumbnailUrl={thumbnailUrl ?? undefined}
          alt={name}
          className={styles['nft-img']}
        />
        <div className={styles['nft-content']}>
          <Typo.Title className={styles['nft-name']}>{name}</Typo.Title>
          <Typo.Normal className={styles['nft-desc']}>
            {description}
          </Typo.Normal>
        </div>
      </div>
      <Form
        className={styles['form']}
        form={form}
        onSubmit={submitNftTransaction}
      >
        <div className={styles['address-container']}>
          <Typo.Title className={styles['address']}>Address</Typo.Title>
          <AddressInput
            form={form}
            className={'mt-[6px]'}
            onChange={(e) => {
              setRecipientForDryRunOnly(e.target.value);
            }}
          />
        </div>
        <div className={styles['gas-container']}>
          <Typo.Title className={styles['gas']}>Gas Budget</Typo.Title>
          <Typo.Normal className={styles['gas-amount']}>
            {formatSUI(gasBudgetResult.gasBudget)} SUI
          </Typo.Normal>
        </div>
        <div className={styles['btn-container']}>
          <Button type={'submit'} state={'primary'} loading={sendLoading}>
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
}
