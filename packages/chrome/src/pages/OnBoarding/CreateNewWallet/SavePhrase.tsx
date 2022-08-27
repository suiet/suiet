import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import Button from "../../../components/Button";
import classnames from "classnames";
import {Extendable} from "../../../types";
import CopyIcon from "../../../components/CopyIcon";
import {CreateWalletStepProps} from "./index";
import copy from 'copy-to-clipboard';
import toast from "../../../components/toast";

type PhraseDisplayProps = Extendable & {
  phrases: string[];
}

const PhraseDisplay = (props: PhraseDisplayProps) => {
  function renderPhraseCol(start: number, end: number) {
    return props.phrases.slice(start, end).map((p, index) => (
      <Typo.Small key={p + index} className={styles['phrase-item']}>{`${index + 1 + start}. ${p}`}</Typo.Small>
    ));
  }

  function copyPhrase() {
    const phraseStr = props.phrases.join(' ')
    copy(phraseStr);
    toast.success('Copied Phrases')
  }

  return (
    <div className={styles['phrase']}>
      <div>
        {renderPhraseCol(0, 6)}
      </div>
      <div className={'ml-[69px]'}>
        {renderPhraseCol(6, 12)}
      </div>
      <CopyIcon
        className={styles['icon-copy']}
        onClick={copyPhrase}
      />
    </div>
  )
}

const SavePhrase = (props: CreateWalletStepProps & {
  phrases: string[];
}) => {
  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]'
        )
      }>Backup your wallet</Typo.Title>
      <section className={'mt-[45px] w-full px-[22px]'}>
        <PhraseDisplay phrases={props.phrases}></PhraseDisplay>
        <Button
          state={'primary'}
          className={classnames(
            styles['step-button'],
            'mt-[32px]'
          )}
          onClick={props.onNext}
        >
          I've saved the Phrase
        </Button>
      </section>
    </div>
  )
}

export default SavePhrase;