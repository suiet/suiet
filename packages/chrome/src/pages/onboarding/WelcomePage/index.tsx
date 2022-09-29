import RectButton from './RectButton';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '../../../layouts/BrandLayout';

const Welcome = () => {
  const navigate = useNavigate();

  function handleCreateNewWallet() {
    navigate('/onboard/create-new-wallet');
  }

  function handleImportWallet() {
    navigate('/onboard/import-wallet');
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
