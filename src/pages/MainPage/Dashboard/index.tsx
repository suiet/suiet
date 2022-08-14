import styles from "./index.module.scss";
import IconCopy from '../../../assets/icons/copy.svg';
import IconDownDouble from '../../../assets/icons/down-double.svg';
import IconQrCode from '../../../assets/icons/qrcode.svg';
import IconTrendUp from '../../../assets/icons/trendup.svg';
import classnames from "classnames";


function MainPage() {
  return (
    <div className={styles['main-content']}>
      <div className={styles['sui-amount']}>1.002 SUI</div>
      <div className={styles['account']}>
        <span>0x2152f....01f6</span>   
        <img className={classnames(styles['icon-copy'], 'ml-[5px]')} src={IconCopy} alt="copy" />
      </div>
      <div className={styles['operations']}>
        <div className={styles['airdrop']}>
          <img src={IconDownDouble} className={styles['icon']} />
          Airdrop
        </div>
        <div className={styles['receive']}>
          <img src={IconQrCode} className={styles['icon']} />
          Receive
        </div>
        <div className={styles['send']}>
          <img src={IconTrendUp} className={styles['icon']} />
          Send
        </div>
      </div>
    </div>
  );
}

export default MainPage;
