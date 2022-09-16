import Dashboard from './Dashboard';
import TokenList from './TokenList';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { useNftList } from '../../hooks/useNftList';
import useTransactionList from '../../hooks/useTransactionList';

function MainPage() {
  const { accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: account } = useAccount(accountId);
  const address = account?.address ?? '';
  // prefetch other tabs' data
  useNftList(address, networkId);
  useTransactionList(address, networkId);

  return (
    <div>
      <Dashboard address={address} networkId={networkId} />
      <TokenList />
    </div>
  );
}

export default MainPage;
