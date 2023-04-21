import classnames from 'classnames';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import IconToken from '../../../assets/icons/token.svg';
import { ReactComponent as VerifiedIcon } from '../../../assets/icons/verified.svg';
import styles from './index.module.scss';
import { Extendable } from '../../../types';
import TokenIcon from '../../../components/TokenIcon';
import Typo from '../../../components/Typo';
import { formatCurrency } from '@suiet/core';
import { isSuiToken } from '../../../utils/check';

type TokenItemProps = Extendable & {
  symbol: string;
  type: string;
  balance: string;
  isVerified: boolean;
  decimals: number;
  iconUrl?: string;
  onClick?: (coinType: string) => void;
  selected?: boolean;
  verified?: boolean;
};

const TokenIconUrl: Record<string, string> = {
  SUI: IconWaterDrop,
  DEFAULT: IconToken,
};

const TokenItem = (props: TokenItemProps) => {
  const {
    balance = 0,
    type: coinType,
    symbol,
    iconUrl,
    decimals,
    onClick,
    selected,
    isVerified,
  } = props;

  let tokenIcon = TokenIconUrl[symbol] || TokenIconUrl.DEFAULT;
  if (iconUrl) {
    tokenIcon = iconUrl;
  }
  const isSUI = isSuiToken(coinType);

  return (
    <div
      className={classnames(
        styles['token-item'],
        isSUI ? styles['token-item-sui'] : null,
        selected && styles['selected'],
        onClick && styles['clickable']
      )}
      onClick={() => {
        onClick?.(coinType);
      }}
    >
      <div className="flex items-center">
        <TokenIcon
          icon={tokenIcon}
          alt="water-drop"
          className={isSUI ? '' : styles['icon-wrap-default']}
        />
        <div className={'flex flex-col ml-[13px]'}>
          <div className="flex items-center">
            <Typo.Normal
              className={classnames(
                styles['token-name'],
                isSUI ? styles['token-name-sui'] : null
              )}
            >
              {symbol}
            </Typo.Normal>
            {isVerified && <VerifiedIcon className="ml-[4px]" />}
          </div>

          <Typo.Small
            className={classnames(
              styles['token-amount'],
              isSUI ? styles['token-amount-sui'] : null
            )}
          >
            {`${formatCurrency(balance, { decimals })} ${symbol}`}
          </Typo.Small>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
