import styles from './Welcome.module.scss';
import Typo from '../../components/Typo';
import LinkButton from './LinkButton';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import LogoGrey from '../../assets/icons/logo-grey.svg';

const Welcome = () => {
  const navigate = useNavigate();

  function handleCreateNewWallet() {
    navigate('/onboard/create-new-wallet');
  }

  function handleImportWallet() {
    navigate('/onboard/import-wallet');
  }

  return (
    <div className={classnames(styles['main-page'], 'mx-[32px]')}>
      <div className={classnames('w-[298px]', 'mx-auto')}>
        <img className={classnames('mt-16')} src={LogoGrey}></img>
        <Typo.Title
          className={classnames(styles['suiet-title'], 'mt-8', 'text-gray-200')}
        >
          Welcome to
        </Typo.Title>
        <Typo.Title className={classnames(styles['suiet-title'], 'text-black')}>
          Suiet
        </Typo.Title>
        <Typo.Normal className={classnames(styles['suiet-desc'])}>
          The wallet for everyone
        </Typo.Normal>
        <section className={'mt-16 flex flex-row items-start gap-4'}>
          <LinkButton
            theme={'primary'}
            className={'w-full'}
            onClick={handleCreateNewWallet}
          >
            Create New
          </LinkButton>
          <LinkButton
            className={'mt-[16px] w-full'}
            onClick={handleImportWallet}
          >
            Import Wallet
          </LinkButton>
        </section>
      </div>
    </div>
  );
};

export default Welcome;
