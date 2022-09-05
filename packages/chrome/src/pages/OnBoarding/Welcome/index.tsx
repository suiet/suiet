import styles from './index.module.scss';
import commonStyles from '../common.module.scss';
import Typo from '../../../components/Typo';
import RectButton from './RectButton';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoGrey } from '../../../assets/icons/logo-grey.svg';
import Icon from '../../../components/Icon';

const Welcome = () => {
  const navigate = useNavigate();

  function handleCreateNewWallet() {
    navigate('/onboard/create-new-wallet');
  }

  function handleImportWallet() {
    navigate('/onboard/import-wallet');
  }

  return (
    <div className={classnames(styles['main-page'])}>
      <Icon elClassName={commonStyles['logo']} icon={<LogoGrey />} />
      <Typo.Title className={classnames(styles['suiet-title'], 'mt-[64px]')}>
        Welcome to
      </Typo.Title>
      <Typo.Title
        className={classnames(
          styles['suiet-title'],
          styles['suiet-title--black']
        )}
      >
        Suiet
      </Typo.Title>
      <Typo.Normal className={classnames(styles['suiet-desc'])}>
        The wallet for everyone.
      </Typo.Normal>
      <section className={'mt-[77px] w-full flex justify-between'}>
        <RectButton theme={'primary'} onClick={handleCreateNewWallet}>
          Create New
        </RectButton>
        <RectButton onClick={handleImportWallet}>Import Wallet</RectButton>
      </section>
    </div>
  );
};

export default Welcome;
