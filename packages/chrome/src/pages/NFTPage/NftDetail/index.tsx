import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from '../../../components/Nav';
import NftImg from '../../../components/NftImg';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import classnames from 'classnames';
import { addressEllipsis } from '../../../utils/format';
import copy from 'copy-to-clipboard';
import message from '../../../components/message';
import CopyIcon from '../../../components/CopyIcon';
import { ReactComponent as IconExternal } from '../../../assets/icons/external.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const NftDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id = '',
    name = '',
    description = '',
    previousTransaction = '',
    objectType = '',
    url = '',
    hasPublicTransfer = false,
  } = location.state || ({} as any);
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
    <div>
      <Nav
        title={'NFT Details'}
        onNavBack={() => {
          navigate('/nft');
        }}
      />
      <div className={styles['container']}>
        <NftImg src={url} alt={name} className={styles['nft-img']} />
        <div className="relative">
          <Typo.Title className={classnames(styles['nft-name'], 'mt-[16px]')}>
            {name}
          </Typo.Title>
          {hasPublicTransfer && (
            <div
              className={styles['nft-send']}
              onClick={() => {
                navigate('/nft/send', {
                  state: {
                    id,
                    name,
                    description,
                    previousTransaction,
                    objectType,
                    url,
                    hasPublicTransfer,
                  },
                });
              }}
            >
              Send
            </div>
          )}
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

        <section className={styles['nft-meta']}>
          <Typo.Title className={styles['sec-title']}>Description</Typo.Title>
          <Typo.Normal className={styles['sec-desc']}>
            {description}
          </Typo.Normal>
        </section>

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
                {objectType}{' '}
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
                {previousTransaction}{' '}
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
            <a
              target="_blank"
              href={getExplorerUrl(id, appContext.networkId)}
              className="m-auto"
              rel="noreferrer"
            >
              View in explorer{' '}
              <IconExternal className="inline w-[12px] h-[12px] stroke-gray-400"></IconExternal>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NftDetail;
