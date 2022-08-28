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
      <div className="block" key={p}>
        <p className={classnames('inline-block','text-gray-300','w-4','text-right')}>{`${index + 1 + start}`}</p>
        <p className={classnames('inline-block', 'ml-3')}>{`${p}`}</p>
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
      'place-content-around',
      'bg-gray-50',
      'gap-5',
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
          'top-4'
        )}
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
          'mt-12',
          'w-full'
        )
      }>Backup <br />your <br />wallet</Typo.Title>
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