import styles from "./index.module.scss";
import AvatarDefault from '../../../assets/avatars/default.svg';
import IconArrowDown from '../../../assets/icons/arrow-down.svg';
import classnames from "classnames";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useAccount} from "../../../hooks/useAccount";
import {addressEllipsis} from "../../../utils/format";

const Avatar = () => {
  return (
    <div className={styles['avatar']}>
      <img src={AvatarDefault} alt="avatar" />
    </div>  
  )
}

function Header() {
  const context = useSelector((state: RootState) => state.appContext)
  const {account} = useAccount(context.wallId, context.accountId);

  return (
    <div className={styles['header-container']}>
      <Avatar />
      <div className={styles['account']}>
        <span className={styles['account-name']}>{account.name}</span>
        <img className="ml-[6px]" src={IconArrowDown} alt="arrow down" />
      </div>
      <div className={classnames(styles['address'], 'ml-[18px]')}>
        {addressEllipsis(account.address)}
      </div>
      <div className={styles['net']}>devnet</div>
    </div>
  );
}
export default Header;
