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
  } = location.state || ({} as any);

  useEffect(() => {
    if (!id) throw new Error('id should be passed within location state');
  }, [id]);

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
        <Typo.Title className={classnames(styles['nft-name'], 'mt-[16px]')}>
          {name}
        </Typo.Title>
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
              href={
                'https://explorer.devnet.sui.io/objects/' +
                encodeURIComponent(id)
              }
              className="m-auto"
              rel="noreferrer"
            >
              View in explorer <IconExternal className="inline"></IconExternal>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NftDetail;
