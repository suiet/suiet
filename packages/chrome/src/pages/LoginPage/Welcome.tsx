import styles from "./index.module.scss";
import Typo from "../../components/Typo";
import LinkButton from "./LinkButton";
import classnames from "classnames";

const Welcome = () => {
  return (
    <div className={styles['main-page']}>
      <Typo.Title className={
        classnames(
          styles['suiet-title'],
          'mt-[160px]'
        )
      }>Suiet</Typo.Title>
      <Typo.Normal className={styles['suiet-desc']}>The wallet for Everyone</Typo.Normal>
      <div className={'mt-[117px] w-full px-[22px]'}>
        <LinkButton
          to={'/settings'}
          type={'primary'}
          className={'w-full'}
        >Create New
        </LinkButton>
        <LinkButton
          to={'/settings'}
          className={'mt-[16px] w-full'
          }>Import Wallet
        </LinkButton>
      </div>
    </div>
  )
}

export default Welcome;