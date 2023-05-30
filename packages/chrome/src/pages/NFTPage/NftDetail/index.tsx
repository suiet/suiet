import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from '../../../components/Nav';
import NftImg from '../../../components/NftImg';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import classnames from 'classnames';
import { addressEllipsis, isNftTransferable } from '@suiet/core';
import copy from 'copy-to-clipboard';
import message from '../../../components/message';
import CopyIcon from '../../../components/CopyIcon';
import { ReactComponent as IconExternal } from '../../../assets/icons/external.svg';

import { ReactComponent as VerifiedIcon } from '../../../assets/icons/verified.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { NftMeta } from '../NftList';
import Tooltip from '../../../components/Tooltip';

const NftDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    objectType = '',
    id = '',
    name = '',
    description = '',
    previousTransaction = '',
    thumbnailUrl,
    url = '',
    hasPublicTransfer = false,
    kioskObjectId,
    attributes,
    verification,
  }: NftMeta = location.state ?? ({} as any);

  const appContext = useSelector((state: RootState) => state.appContext);

  useEffect(() => {
    if (!id) throw new Error('id should be passed within location state');
  }, [id]);

  function getExplorerUrl(id: string, networkId: string) {
    return (
      `https://explorer.sui.io/objects/` +
      encodeURIComponent(id) +
      `?network=${networkId}`
    );
  }

  return (
    <div className={styles['page']}>
      <Nav
        title={'NFT Details'}
        onNavBack={() => {
          navigate('/nft');
        }}
      />
      <div className={styles['container']}>
        <NftImg
          src={url}
          thumbnailUrl={thumbnailUrl ?? undefined}
          alt={name}
          className={styles['nft-img']}
        />

        <div className="relative flex">
          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-1 mt-[16px] mb-2">
              <Typo.Title className={classnames(styles['nft-name'], 'shrink')}>
                {name}
              </Typo.Title>
              {verification.status === 'VERIFIED' && (
                <Tooltip message="Verified">
                  <VerifiedIcon className="w-[16px] h-[16px] shrink-0" />
                </Tooltip>
              )}
            </div>
            <div className="flex">
              <Typo.Small
                className={classnames(styles['nft-tag'])}
                onClick={() => {
                  copy(id);
                  message.success('Copied Object ID');
                }}
              >
                {'ID: ' + addressEllipsis(id)}
              </Typo.Small>
            </div>
          </div>
          {/* TODO: add hasPublicTransfer indicator in graphql  */}
          {isNftTransferable({
            hasPublicTransfer,
            kioskObjectId,
          }) && (
            <div
              className={classnames(styles['nft-send'], 'flex-grow-0')}
              onClick={() => {
                navigate('/nft/send', {
                  state: location.state,
                });
              }}
            >
              Send
            </div>
          )}
        </div>

        <section className={styles['nft-meta']}>
          <Typo.Title className={styles['sec-title']}>Description</Typo.Title>
          <Typo.Normal className={styles['sec-desc']}>
            {description}
          </Typo.Normal>
        </section>

        {attributes && (
          <section className={styles['nft-meta']}>
            <Typo.Title className={styles['sec-title']}>Attributes</Typo.Title>
            <div className="flex flex-wrap gap-3">
              {attributes.map((attribute, index) => {
                return (
                  <div
                    className="bg-sky-50 hover:bg-sky-100 transition rounded-2xl w-full p-4 px-6"
                    key={index}
                  >
                    <div className="text-sky-600">{attribute.key}</div>
                    <div className="text-zinc-700 font-bold">
                      {attribute.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className={styles['sec-detail-item-container']}>
          <Typo.Title className={styles['sec-title']}>
            Object Details
          </Typo.Title>
          <div className={styles['sec-detail-item']}>
            <span className={styles['sec-detail-item-key']}>Type</span>
            <div
              className="transaction-detail-item-tx flex items-center"
              onClick={() => {
                copy(objectType);
                message.success('Copied Object Type');
              }}
            >
              <span className="text-ellipsis overflow-hidden max-w-[160px] whitespace-nowrap cursor-pointer">
                {objectType}
              </span>
              <CopyIcon
                className={classnames(
                  'ml-[5px]',
                  'inline',
                  'whitespace-nowrap'
                )}
              />
            </div>
          </div>
          <div className={styles['sec-detail-item']}>
            <span className={styles['sec-detail-item-key']}>
              Previous TX ID
            </span>
            <div
              className="transaction-detail-item-tx flex items-center"
              onClick={() => {
                copy(previousTransaction);
                message.success('Copied TX ID');
              }}
            >
              <span className="text-ellipsis overflow-hidden max-w-[160px] whitespace-nowrap cursor-pointer">
                {previousTransaction}
              </span>
              <CopyIcon
                className={classnames(
                  'ml-[5px]',
                  'inline',
                  'whitespace-nowrap'
                )}
              />
            </div>
          </div>
          <div className={classnames(styles['sec-detail-item'], 'mt-4')}>
            <a
              target="_blank"
              href={getExplorerUrl(id, appContext.networkId)}
              className="m-auto"
              rel="noreferrer"
            >
              View in explorer
              <IconExternal className="inline w-[12px] h-[12px] stroke-gray-400"></IconExternal>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NftDetail;
