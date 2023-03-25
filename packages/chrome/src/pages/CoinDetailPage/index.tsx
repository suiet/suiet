import AppLayout from '../../layouts/AppLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useWallet } from '../../hooks/useWallet';
import Avatar from '../../components/Avatar';
import IconWaterDrop from '../../assets/icons/waterdrop.svg';
import IconToken from '../../assets/icons/token.svg';
import styles from './index.module.scss';
import TokenIcon from '../../components/TokenIcon';
import classNames from 'classnames';
import { useCoins } from '../../hooks/useCoins';
import { useNetwork } from '../../hooks/useNetwork';
import { formatSUI } from '../../utils/format';
import { ReactComponent as IconStakeFilled } from '../../assets/icons/stake-filled.svg';
import { ReactComponent as IconStake } from '../../assets/icons/stake.svg';
export default function CoinDetailPage() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const params = useParams();
  const symbol = params['symbol'];
  const { context } = useSelector((state: RootState) => ({
    context: state.appContext,
  }));
  const navigate = useNavigate();
  const { address } = useAccount(context.accountId);
  const dispatch = useDispatch<AppDispatch>();
  const { data: wallet } = useWallet(context.walletId);

  const {
    data: coinsBalance,
    getBalance,
    error,
  } = useCoins(address, appContext.networkId);
  const balance = symbol ? getBalance(symbol) : 0;

  return (
    <AppLayout>
      {/* <div className="">{params['symbol']}</div> */}
      {/* <div className="">{JSON.stringify(wallet)}</div> */}
      <div className="flex justify-center pt-8">
        <div className="flex">
          <Avatar
            className={classNames('border-2 border-white', 'mr-[-18px]')}
            size={'lg'}
            model={wallet?.avatar}
          />
          <TokenIcon
            icon={symbol === 'SUI' ? IconWaterDrop : IconToken}
            alt="water-drop"
            size="large"
            className={classNames(
              'border-2 border-white',
              'w-[64px] h-[64px]',
              symbol === 'SUI' ? '' : styles['icon-wrap-default']
            )}
          />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center">
        <div className="mt-4">
          <p className="inline text-3xl font-bold">{formatSUI(balance)}</p>{' '}
          <p className="inline text-3xl font-bold text-zinc-400">SUI</p>
        </div>

        <div className="">
          <p className="inline text-2 text-zinc-400"> Earned 0.222 SUI </p>
        </div>
      </div>

      <div className="balance details flex mt-2 mx-6 justify-between">
        <div className="free-balance">
          <p className="text-zinc-400 font-normal">Avaliable</p>
          <div className="font-bold">2.2333 SUI</div>
        </div>
        <div className="staked-balance text-right">
          <p className="text-zinc-400 font-normal">Stake</p>
          <div className="font-bold">2.2333 SUI</div>
        </div>
      </div>

      <div className="w-full px-6 rounded-full overflow-hidden">
        <div className="w-full rounded-full mx-auto h-2 bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-300 transition-all duration-500 ease-in-out"
            style={{ width: `${20.2}%` }}
          ></div>
        </div>
      </div>

      <div className="mx-6 mt-6">
        <div className="text-zinc-400">Staking on {2} validators</div>

        <div className="flex flex-col mt-2">
          <div className="flex justify-between items-center  bg-zinc-50 w-full rounded-xl p-3 ">
            <div className="flex gap-4 items-center">
              <IconStake />
              <div className="">
                <div className="font-bold">Validator1</div>
                <div className="text-zinc-400 font-normal text-sm">
                  Validator1 Desc
                </div>
              </div>
            </div>
            <div className="font-medium">
              {0.23} <div className="inline text-zinc-400">SUI</div>{' '}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
