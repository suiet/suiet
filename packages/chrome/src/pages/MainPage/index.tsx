import Dashboard from './Dashboard';
import TokenList from './TokenList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import AppLayout from '../../layouts/AppLayout';
import { useDappList } from '../../hooks/useDappList';
import BiometricSetup from '../../components/BiometricSetup';
import useCheckAvatarPfpValidness from './hooks/useCheckAvatarPfpValidness';

function MainPage() {
  const { accountId, networkId, walletId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { address } = useAccount(accountId);
  // prefetch other tabs' data
  useNftList(address);
  useDappList();

  useCheckAvatarPfpValidness(walletId, address);

  return (
    <AppLayout>
      <Dashboard address={address} networkId={networkId} />
      <BiometricSetup />
      <TokenList />
    </AppLayout>
  );
}

export default MainPage;
