import classnames from "classnames";
import type { StyleExtendable } from "../../../types";
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import styles from './index.module.scss';

export type TokenListProps = StyleExtendable;

const TokenIcon = () => {
  return (
    <div className={styles['icon-wrap']}>
      <img className={styles['icon-wrap-icon']} src={IconWaterDrop} alt="water-drop" />
    </div>
  )
}

const TokenItem = () => {
  return (
    <div className={styles['token-item']}>
      <div className="flex items-center">
        <TokenIcon />
        <strong className="ml-[12px]">SUI</strong>
        <p className={classnames(styles['token-amonut'], 'ml-[120px]')}>1.002</p>
      </div>
    </div>
  )
}

const TokenList: React.FC<TokenListProps> = (props) => {
  return (
    <div 
      className={classnames(props.className)} 
      style={props.style}
    >
      <TokenItem />
      <TokenItem />
    </div>
  )
}

export default TokenList;