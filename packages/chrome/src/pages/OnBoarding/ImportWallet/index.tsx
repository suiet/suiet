import {useNavigate} from "react-router-dom";
import classnames from "classnames";
import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import Textarea from "../../../components/Textarea";
import Button from "../../../components/Button";

const ImportWallet = () => {
  const navigate = useNavigate();

  function handleConfirm() {
    navigate('/home')
  }

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-12',
          'w-full'
        )
      }>Import<br/>Your<br/>Wallet</Typo.Title>
      <Typo.Normal className={classnames(
        'mt-2',
        'w-full',
        'text-base',
        'text-left')}>Using recovery phrase or secret key</Typo.Normal>
      <section className={'mt-[32px] w-full'}>
        <div>
          <Textarea
            className={'mt-[6px]'}
            elClassName={styles['phrase-textarea']}
            placeholder={'paste recovery phrase or private key...'}
          />
        </div>
      </section>


      <Button state={'primary'} className={'mt-[84px]'} onClick={handleConfirm}>Confirm</Button>
    </div>
  )
}

export default ImportWallet;