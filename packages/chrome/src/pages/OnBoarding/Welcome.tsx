import styles from "./Welcome.module.scss";
import Typo from "../../components/Typo";
import LinkButton from "./LinkButton";
import classnames from "classnames";
import {useNavigate} from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  function handleCreateNewWallet() {
    navigate('/onboard/create-new-wallet')
  }

  function handleImportWallet() {
    navigate('/onboard/import-wallet')
  }

  return (
    <div className={styles['main-page']}>
      <Typo.Title className={
        classnames(
          styles['suiet-title'],
          'mt-[160px]'
        )
      }>Suiet</Typo.Title>
      <Typo.Normal className={styles['suiet-desc']}>The wallet for Everyone</Typo.Normal>
      <section className={'mt-[117px] w-full px-[22px]'}>
        <LinkButton
          theme={'primary'}
          className={'w-full'}
          onClick={handleCreateNewWallet}
        >Create New
        </LinkButton>
        <LinkButton
          className={'mt-[16px] w-full'}
          onClick={handleImportWallet}
        >Import Wallet</LinkButton>
      </section>
    </div>
  )
}

export default Welcome;