import styles from './index.module.scss';
import commonStyles from './common.module.scss';
import Typo from '../../components/Typo';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import Nav from '../../components/Nav';
import TokenItem from './TokenItem';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AddressInputPage from './AddressInput';
import SendConfirm from './SendConfirm';
import Skeleton from 'react-loading-skeleton';
import useCoins, { CoinDto } from '../../hooks/coin/useCoins';
import { isNonEmptyArray, TransferCoinParams } from '@suiet/core';
import { DEFAULT_SUI_COIN } from '../../constants/coin';
import { SendData } from './types';
import { compareCoinAmount, isSafeConvertToNumber } from '../../utils/check';
import message from '../../components/message';
import { useNetwork } from '../../hooks/useNetwork';
import { useApiClient } from '../../hooks/useApiClient';
import { OmitToken } from '../../types';
import useSuiBalance from '../../hooks/coin/useSuiBalance';

enum Mode {
  symbol,
  address,
  confirm,
}

function useCoinsWithSuiOnTop(address: string) {
  const { data: coins, ...rest } = useCoins(address);
  const coinsWithSuiOnTop = useMemo(() => {
    if (isNonEmptyArray(coins)) {
      const suiCoin = coins.find((coin) => coin.symbol === 'SUI');
      const otherCoins = coins.filter((coin) => coin.symbol !== 'SUI');
      return [suiCoin, ...otherCoins] as CoinDto[];
    } else {
      return [DEFAULT_SUI_COIN];
    }
  }, [coins]);

  return { data: coinsWithSuiOnTop, ...rest };
}

const SendPage = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { accountId, walletId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: network } = useNetwork(networkId);
  const { address } = useAccount(accountId);
  const { data: suiBalance } = useSuiBalance(address);

  const [selectedCoin, setSelectedCoin] = useState<CoinDto>(DEFAULT_SUI_COIN);
  const [mode, setMode] = useState(Mode.symbol);
  const [sendData, setSendData] = useState<SendData>({
    recipientAddress: '',
    coinType: '',
    coinAmountWithDecimals: '0',
  });

  const { data: coinsWithSuiOnTop, loading: coinsLoading } =
    useCoinsWithSuiOnTop(address);

  useEffect(() => {
    if (coinsWithSuiOnTop.length === 0) return;
    if (selectedCoin === DEFAULT_SUI_COIN) {
      const firstCoin = coinsWithSuiOnTop[0];
      setSendData((prev) => ({
        ...prev,
        coinType: firstCoin.type,
      }));
      setSelectedCoin(firstCoin);
    }
  }, [coinsWithSuiOnTop]);

  const submitTransaction = useCallback(async () => {
    // example address: ECF53CE22D1B2FB588573924057E9ADDAD1D8385
    if (!network) throw new Error('require network selected');

    const { coinAmountWithDecimals } = sendData;
    let coinAmount: string;
    const precision = 10 ** selectedCoin.decimals;
    if (isSafeConvertToNumber(coinAmountWithDecimals)) {
      coinAmount = String(+coinAmountWithDecimals * precision);
    } else {
      coinAmount = String(BigInt(coinAmountWithDecimals) * BigInt(precision));
    }

    try {
      await apiClient.callFunc<OmitToken<TransferCoinParams>, undefined>(
        'txn.transferCoin',
        {
          network,
          coinType: sendData.coinType,
          amount: coinAmount,
          recipient: sendData.recipientAddress,
          walletId: walletId,
          accountId: accountId,
        },
        { withAuth: true }
      );
      message.success('Send transaction succeeded');
      // TODO: refetch
      // setTimeout(() => {
      //   refetch(swrKeyWithNetwork(swrKeyForUseCoins, network));
      // }, 1000);
      navigate('/transaction/flow');
    } catch (e: any) {
      console.error(e);
      message.error(`Send transaction failed: ${e?.message}`);
    }
  }, [selectedCoin, sendData, network, walletId, accountId]);

  return (
    <>
      <Nav
        position={'relative'}
        onNavBack={() => {
          switch (mode) {
            case Mode.symbol:
              navigate(-1);
              break;
            case Mode.address:
              setMode(Mode.symbol);
              break;
            case Mode.confirm:
              setMode(Mode.address);
              break;
            default:
          }
        }}
        title="Send"
      />
      {mode === Mode.symbol && (
        <>
          <div className={'px-[32px]'}>
            <Typo.Title className={'mt-[48px] font-bold text-[36px]'}>
              Select Token
            </Typo.Title>
            <Typo.Normal className={`mt-[8px] ${styles['desc']}`}>
              Choose the token you want to send
            </Typo.Normal>
          </div>
          <div className={styles['token-list']}>
            {coinsLoading && (
              <Skeleton width="100%" height="73px" className="block" />
            )}
            {!coinsLoading &&
              coinsWithSuiOnTop.map((coin) => {
                return (
                  <TokenItem
                    key={coin.type}
                    type={coin.type}
                    symbol={coin.symbol}
                    balance={coin.balance}
                    decimals={coin.decimals}
                    verified={coin.isVerified}
                    selected={sendData.coinType === coin.type}
                    onClick={(coinType) => {
                      setSelectedCoin(coin);
                      setSendData((prev) => ({
                        ...prev,
                        coinType,
                      }));
                    }}
                  />
                );
              })}
          </div>
          <div className={commonStyles['next-step']}>
            <Button
              type={'submit'}
              state={'primary'}
              disabled={
                !sendData.coinType ||
                compareCoinAmount(selectedCoin.balance, 0) <= 0
              }
              onClick={() => {
                setMode(Mode.address);
              }}
            >
              {compareCoinAmount(selectedCoin.balance, 0) <= 0
                ? 'Insufficient Balance'
                : 'Next Step'}
            </Button>
          </div>
        </>
      )}
      {mode === Mode.address && (
        <AddressInputPage
          onNext={() => {
            setMode(Mode.confirm);
          }}
          state={sendData}
          onSubmit={(address) => {
            setSendData((prev) => {
              return {
                ...prev,
                recipientAddress: address,
              };
            });
          }}
        />
      )}
      {mode === Mode.confirm && (
        <SendConfirm
          state={sendData}
          selectedCoin={selectedCoin}
          suiBalance={suiBalance.balance}
          onInputCoinAmountWithDecimals={(amountWithDecimals) => {
            setSendData((prev) => {
              return {
                ...prev,
                coinAmountWithDecimals: amountWithDecimals,
              };
            });
          }}
          onSubmit={submitTransaction}
        />
      )}
    </>
  );
};

export default SendPage;
