import styles from "./index.module.scss";
import Typo from "../../components/Typo";
import LinkButton from "./LinkButton";
import classnames from "classnames";
import Input from "../../components/Input";

const Welcome = () => {
  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]'
        )
      }>Set wallet password</Typo.Title>
      <section className={'mt-[214px] w-full px-[22px]'}>
        <div>
          <Typo.Small className={styles['pwd']}>Password</Typo.Small>
          <Input className={'mt-[6px]'} placeholder={'Please enter the password'} />
        </div>
        <LinkButton
          to={'/settings'}
          type={'primary'}
          className={classnames(
            styles['step-button'],
            'mt-[16px]'
          )
        }
        >
          Next
        </LinkButton>
      </section>
    </div>
  )
}

export default Welcome;