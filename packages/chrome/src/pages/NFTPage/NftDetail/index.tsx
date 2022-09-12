import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from '../../../components/Nav';
import NftImg from '../../../components/NftImg';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import classnames from 'classnames';

const NftDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id = '',
    name = '',
    description = '',
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

        <section className={styles['nft-meta']}>
          <Typo.Title className={styles['sec-title']}>Description</Typo.Title>
          <Typo.Normal className={styles['sec-desc']}>
            {description}
          </Typo.Normal>
        </section>
      </div>
    </div>
  );
};

export default NftDetail;
