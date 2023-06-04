import RectButton from './RectButton';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '../../../layouts/BrandLayout';
import { useEffectAdjustInitializedStatus } from '../../../hooks/useEffectAdjustInitializedStatus';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useRef, useState } from 'react';
import SetNewPassword from './views/SetPasswordView';
import { useApiClient } from '../../../hooks/useApiClient';
import SetPasswordView from './views/SetPasswordView';
import { PageEntry } from '../../../hooks/usePageEntry';
import Nav from '../../../components/Nav';

enum Step {
  WELCOME,
  SET_PASSWORD,
}

enum OnboardType {
  NOT_SET,
  CREATE_NEW_WALLET,
  IMPORT_WALLET,
}

const WelcomePage = () => {
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const [step, setStep] = useState<Step>(Step.WELCOME);
  const [onboardType, setOnboardType] = useState<OnboardType>(
    OnboardType.NOT_SET
  );
  const nextRoute = useRef<string>('');
  const apiClient = useApiClient();

  function handleCreateNewWallet() {
    nextRoute.current = '/onboard/create-new-wallet';
    setOnboardType(OnboardType.CREATE_NEW_WALLET);
    setStep(Step.SET_PASSWORD);
  }

  function handleImportWallet() {
    nextRoute.current = '/onboard/import-wallet';
    setOnboardType(OnboardType.IMPORT_WALLET);
    setStep(Step.SET_PASSWORD);
  }

  function handleNavBack() {
    nextRoute.current = '';
    setOnboardType(OnboardType.NOT_SET);
    setStep(Step.WELCOME);
  }

  useEffectAdjustInitializedStatus(appContext);

  function renderWelcomeView() {
    return (
      <BrandLayout
        grayTitle={'Welcome to'}
        blackTitle={'Suiet'}
        desc={'The wallet for everyone.'}
      >
        <section className={'px-[32px] mt-[77px] w-full flex justify-between'}>
          <RectButton theme={'primary'} onClick={handleCreateNewWallet}>
            Create New
          </RectButton>
          <RectButton onClick={handleImportWallet}>Import Wallet</RectButton>
        </section>
      </BrandLayout>
    );
  }

  async function handleSetNewPassword(password: string) {
    await apiClient.callFunc<string, undefined>('auth.initPassword', password);
    if (!nextRoute.current) {
      throw new Error('nextRoute is not set');
    }
    navigate(nextRoute.current, {
      state: {
        pageEntry: PageEntry.ONBOARD,
      },
    });
  }

  function renderView() {
    if (appContext.initialized) {
      setTimeout(() => {
        navigate('/');
      }, 0);
      return null;
    }

    if (step === Step.SET_PASSWORD) {
      return (
        <div className={'flex-1 bg-white'}>
          <Nav
            title={
              onboardType === OnboardType.IMPORT_WALLET
                ? 'Import Wallet'
                : 'Create New'
            }
            onNavBack={handleNavBack}
          />
          <SetPasswordView type={'new'} onNext={handleSetNewPassword} />
        </div>
      );
    }
    return renderWelcomeView();
  }

  return renderView();
};

export default WelcomePage;
