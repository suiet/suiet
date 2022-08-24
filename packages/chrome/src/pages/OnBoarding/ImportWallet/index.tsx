import {useState} from "react";
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
          'mt-[80px]'
        )
      }>Import Wallet</Typo.Title>

      <section className={'mt-[32px] w-full px-[22px]'}>
        <div>
          <Typo.Normal>Recovery Phrase or Private Key</Typo.Normal>
          <Textarea
            className={'mt-[6px]'}
            elClassName={styles['phrase-textarea']}
            placeholder={'Paste here...'}
          />
          <Typo.Hints className={'mt-[6px]'}>Displayed when you first created your wallet.</Typo.Hints>
        </div>
      </section>


      <Button state={'primary'} className={'mt-[84px]'} onClick={handleConfirm}>Confirm</Button>
    </div>
  )
}

export default ImportWallet;