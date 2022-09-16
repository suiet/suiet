import Avatar from '../../../components/Avatar';
import Typo from '../../../components/Typo';
import Icon from '../../../components/Icon';
import { ReactComponent as IconLink } from '../../../assets/icons/link.svg';
import { ReactComponent as IconPermYes } from '../../../assets/icons/perm-yes.svg';
import { ReactComponent as IconPermNo } from '../../../assets/icons/perm-no.svg';
import Button from '../../../components/Button';
import styles from './index.module.scss';
import classnames from 'classnames';

const ConnectPage = () => {
  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <div className={styles['header-icons']}>
          <div className={styles['header-favicon']}>
            <img src={''} />
          </div>
          <Avatar className={styles['header-avatar']} />
        </div>
        <Typo.Title className={styles['header-title']}>Connect</Typo.Title>
        <div className={classnames(styles['connect-item'], 'mt-[16px]')}>
          <Icon icon={<IconLink />} className={styles['connect-item-icon']} />
          <Typo.Normal className={styles['connect-item-name']}>
            Localhost:5173
          </Typo.Normal>
          <Typo.Small className={styles['connect-item-desc']}>
            http://localhost:5173/
          </Typo.Small>
        </div>
        <div className={classnames(styles['connect-item'], 'mt-[4px]')}>
          <Avatar className={styles['connect-item-icon']} />
          <Typo.Normal className={styles['connect-item-name']}>
            Localhost:5173
          </Typo.Normal>
          <Typo.Small className={styles['connect-item-desc']}>
            http://localhost:5173/
          </Typo.Small>
        </div>
      </header>
      <div className={'px-[32px]'}>
        <hr />
      </div>
      <div className={styles['sections']}>
        <section>
          <Typo.Normal className={styles['perm-title']}>
            This app will be available to:
          </Typo.Normal>
          <div className={styles['perm-item']}>
            <Icon className={styles['perm-item-icon']} icon={<IconPermYes />} />{' '}
            <Typo.Small className={styles['perm-item-desc']}>
              Share wallet address
            </Typo.Small>
          </div>
          <div className={styles['perm-item']}>
            <Icon className={styles['perm-item-icon']} icon={<IconPermYes />} />{' '}
            <Typo.Small className={styles['perm-item-desc']}>
              Suggest transactions to approve
            </Typo.Small>
          </div>
        </section>
        <section className={'mt-[16px]'}>
          <Typo.Normal className={styles['perm-title']}>
            This app will NOT be available to:
          </Typo.Normal>
          <div className={styles['perm-item']}>
            <Icon className={styles['perm-item-icon']} icon={<IconPermNo />} />{' '}
            <Typo.Small className={styles['perm-item-desc']}>
              Move tokens & NFTs without your approval
            </Typo.Small>
          </div>
        </section>
      </div>

      <footer className={styles['footer']}>
        <Button>Cancel</Button>
        <Button state={'primary'} className={'ml-[8px]'}>
          Connect
        </Button>
      </footer>
    </div>
  );
};

export default ConnectPage;
