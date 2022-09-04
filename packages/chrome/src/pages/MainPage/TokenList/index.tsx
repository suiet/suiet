import classnames from 'classnames';
import type { StyleExtendable } from '../../../types';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import styles from './index.module.scss';
import TokenIcon from '../../../components/TokenIcon';
import { useSupportedCoins } from '../../../hooks/useSupportedCoins';

export type TokenListProps = StyleExtendable;

const TokenItem = () => {
  return (
    <div className={styles['token-item']}>
      <div className="flex items-center">
        <TokenIcon icon={IconWaterDrop} alt="water-drop" />
        <strong className={classnames(styles['token-name'], 'ml-[12px]')}>
          SUI
        </strong>
        <p className={classnames(styles['token-amonut'], 'ml-[120px]')}>1000</p>
      </div>
    </div>
  );
};

const TokenList = (props: TokenListProps) => {
  const { data: supportedCoins } = useSupportedCoins();
  console.log('supportedCoins', supportedCoins);
  if (!supportedCoins) return null;
  return (
    <div className={classnames(props.className)} style={props.style}>
      {supportedCoins.map((coin) => {
        return <TokenItem key={coin.packageId} />;
      })}
    </div>
  );
};

export default TokenList;
