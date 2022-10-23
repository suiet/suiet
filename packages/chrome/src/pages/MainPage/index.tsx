import Dashboard from './Dashboard';
import TokenList from './TokenList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import useTransactionList from '../../hooks/useTransactionList';
import AppLayout from '../../layouts/AppLayout';
import { useDappList } from '../../hooks/useDappList';
import BiometricSetup from '../../components/BiometricSetup';

function MainPage() {
  const { accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: account } = useAccount(accountId);
  const address = account?.address ?? '';
  // prefetch other tabs' data
  useNftList(address, networkId);
  useTransactionList(address, networkId);
  useDappList();

  return (
    <AppLayout>
      <Dashboard address={address} networkId={networkId} />
      <BiometricSetup />
      <TokenList />
    </AppLayout>
  );
}

export default MainPage;
