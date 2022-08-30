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
      <div className={classnames('py-1')}>
        <p className={classnames('inline-block','text-gray-300','w-4','text-right','select-none')}>{`${index + 1 + start}`}</p>
        <p className={classnames('inline-block','text-gray-700', 'ml-3','w-20','font-mono')}>{`${p}`}</p>
      </div>
    ));
  }

  function copyPhrase() {
    const phraseStr = props.phrases.join(' ')
    copy(phraseStr);
    toast.success('Copied Phrases')
  }

  return (
    <div className={classnames('flex',
      'flex-row',
      'justify-evenly',
      'justify-items-center',
      'bg-gray-50',
      'relative',
      'rounded-lg',
      'py-5')}>
      <div>
        {renderPhraseCol(0, 6)}
      </div>
      <div className={classnames()}>
        {renderPhraseCol(6, 12)}
      </div>
      <CopyIcon
        className={classnames(
          'absolute',
          'right-4',
          'top-4',
          'w-4',
          'h-4'
        )}
        onClick={copyPhrase}
      />
    </div>
  )
}

const SavePhrase = (props: {
  phrases: string[];
  onNext: () => void;
}) => {
  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-12',
          'w-full'
        )
      }>Backup<br />your<br />wallet</Typo.Title>
      <Typo.Normal className={classnames(
        'mt-2',
        'w-full',
        'text-base',
        'text-left')}>Copy and save your recovery phrase</Typo.Normal>
      <section className={'mt-[45px] w-full'}>
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