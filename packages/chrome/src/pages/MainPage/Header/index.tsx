import styles from './index.module.scss';
import AvatarDefault from '../../../assets/avatars/default.svg';
import IconArrowRight from '../../../assets/icons/arrow-right.svg';
import classnames from 'classnames';

const Avatar = () => {
  return (
    <div className={styles['avatar']}>
      <img src={AvatarDefault} alt="avatar" />
    </div>
  );
};

function Header() {
  return (
    <div className={styles['header-container']}>
      <Avatar />
      <div className={styles['account']}>
        <span>Account1</span>
        <img className="ml-[6px]" src={IconArrowRight} alt="arrow down" />
      </div>
      <div className={classnames(styles['address'], 'ml-[18px]')}>
        0x2152f....01f6 <span></span>
      </div>
      <div className={styles['net']}>devnet</div>
    </div>
  );
}
export default Header;
