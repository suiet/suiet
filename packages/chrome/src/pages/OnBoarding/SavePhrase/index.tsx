import commonStyles from "../common.module.scss";
import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import Button from "../../../components/Button";
import classnames from "classnames";
import {Extendable} from "../../../types";
import CopyIcon from "../../../components/CopyIcon";
import copy from 'copy-to-clipboard';
import toast from "../../../components/toast";

type PhraseDisplayProps = Extendable & {
  phrases: string[];
}

const PhraseDisplay = (props: PhraseDisplayProps) => {
  function renderPhraseCol(start: number, end: number) {
    return props.phrases.slice(start, end).map((p, index) => (
      <div key={p} className={styles['phrase-item']}>
        <span className={styles['phrase-order']}>{`${index + 1 + start}`}</span>
        <span className={styles['phrase-word']}>{`${p}`}</span>
      </div>
    ));
  }

  return (
    <div className={styles['phrase']}>
      <div className={styles['phrase-wrap']}>
        {renderPhraseCol(0, 12)}
      </div>
      <CopyIcon
        copyStr={props.phrases?.join(' ') || ''}
        onCopied={() => {
          toast.success('Copied Phrases')
        }}
        className={styles['icon-copy']}
      />
    </div>
  )
}

const SavePhrase = (props: {
  phrases: string[];
  onNext: () => void;
}) => {
  return (
    <div className={commonStyles['container']}>
      <Typo.Title className={commonStyles['step-title']}>
        Backup<br/>Your<br/>Wallet
      </Typo.Title>
      <Typo.Normal className={commonStyles['step-desc']}>
        Copy and save your recovery phrase.
      </Typo.Normal>
      <section className={'mt-[24px]'}>
        <PhraseDisplay phrases={props.phrases}></PhraseDisplay>
        <Button
          state={'primary'}
          className={'mt-[32px]'}
          onClick={props.onNext}
        >
          Confirm and Create
        </Button>
      </section>
    </div>
  )
}

export default SavePhrase;