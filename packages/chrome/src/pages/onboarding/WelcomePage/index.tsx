import RectButton from './RectButton';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '../../../layouts/BrandLayout';
import { useEffectAdjustInitializedStatus } from '../../../hooks/useEffectAdjustInitializedStatus';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const Welcome = () => {
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);

  function handleCreateNewWallet() {
    navigate('/onboard/create-new-wallet');
  }

  function handleImportWallet() {
    navigate('/onboard/import-wallet');
  }

  useEffectAdjustInitializedStatus(appContext);

  if (appContext.initialized) {
    setTimeout(() => {
      navigate('/');
    }, 0);
    return null;
  }
  return (
    <BrandLayout
      grayTitle={'Welcome to'}
      blackTitle={'Suiet'}
      desc={'The wallet for everyone.'}
    >
      <section className={'mt-[77px] w-full flex justify-between'}>
        <RectButton theme={'primary'} onClick={handleCreateNewWallet}>
          Create New
        </RectButton>
        <RectButton onClick={handleImportWallet}>Import Wallet</RectButton>
      </section>
    </BrandLayout>
  );
};

export default Welcome;
