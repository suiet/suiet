import classnames from "classnames";
import type { StyleExtendable } from "../../../types";
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import styles from './index.module.scss';
import TokenIcon from "../../../components/TokenIcon";

export type TokenListProps = StyleExtendable;

const TokenItem = () => {
  return (
    <div className={styles['token-item']}>
      <div className="flex items-center">
        <TokenIcon icon={IconWaterDrop} alt="water-drop" />
        <strong className={classnames(styles['token-name'], 'ml-[12px]')}>SUI</strong>
        <p className={classnames(styles['token-amonut'], 'ml-[120px]')}>1000</p>
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