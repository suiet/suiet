import styles from './index.module.scss';
import commonStyles from './common.module.scss';
import Typo from '../../components/Typo';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import WaterDropIcon from '../../components/WaterDropIcon';
import { isValidSuiAddress, SUI_TYPE_ARG } from '@mysten/sui.js';
import { useForm } from 'react-hook-form';
import message from '../../components/message';
import Form from '../../components/form/Form';
import FormControl from '../../components/form/FormControl';
import { getInputStateByFormState } from '../../utils/form';
import { CoinSymbol, useCoinBalance } from '../../hooks/useCoinBalance';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import {
  Coins,
  swrKey as swrKeyForUseCoins,
  useCoinsGql,
} from '../../hooks/useCoins';
import Nav from '../../components/Nav';
import TokenItem from '../../components/TokenItem';
import { useEffect, useState } from 'react';
import AddressInputPage from './AddressInput';
import SendConfirm from './SendConfirm';
import Skeleton from 'react-loading-skeleton';

enum Mode {
  symbol,
  address,
  confirm,
}

const defaultCoin = {
  symbol: 'SUI',
  description: '',
  isVerified: true,
  metadata: {
    decimals: 9,
  },
  balance: '0',
  type: '',
  iconURL: '',
};

const SendPage = () => {
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const { coins, loading: coinsLoading } = useCoinsGql(address, [defaultCoin]);
  const [selectedCoin, setSelectedCoin] = useState<Coins>();
  const [mode, setMode] = useState(Mode.symbol);
  const [sendData, setSendData] = useState({
    address: '',
    symbol: '',
    amount: 0,
  });

  useEffect(() => {
    if (coins.length > 0) {
      sendData.symbol = coins[0].symbol;
      setSelectedCoin(coins[0]);
    }
  }, [coinsLoading]);

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
              return;
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
          {coinsLoading && (
            <Skeleton
              width="330px"
              height="92px"
              style={{
                margin: '24px 16px',
              }}
            />
          )}
          {!coinsLoading && coins.length > 0 && (
            <div className={styles['token-list']}>
              {coins.map((coin) => {
                const { symbol, balance, metadata } = coin;
                return (
                  <TokenItem
                    key={symbol}
                    symbol={symbol}
                    amount={balance}
                    decimals={metadata.decimals}
                    selected={sendData.symbol === symbol}
                    onClick={(symbol) => {
                      setSelectedCoin(coin);
                      setSendData((prev) => {
                        return {
                          ...prev,
                          symbol: symbol,
                        };
                      });
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className={commonStyles['next-step']}>
            <Button
              type={'submit'}
              state={'primary'}
              disabled={!sendData.symbol}
              onClick={() => {
                setMode(Mode.address);
              }}
            >
              Next Step
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
                address,
              };
            });
          }}
        />
      )}
      {mode === Mode.confirm && (
        <SendConfirm
          state={sendData}
          coin={selectedCoin}
          balance={
            Number(selectedCoin?.balance) /
            10 ** (selectedCoin?.metadata.decimals || 0)
          }
          symbol={selectedCoin?.symbol || ''}
          onSubmit={(amount) => {
            setSendData((prev) => {
              return {
                ...prev,
                amount,
              };
            });
          }}
        />
      )}
    </>
  );
};

export default SendPage;
