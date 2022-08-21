import styles from "./index.module.scss";
import Typo from "../../../components/Typo";
import LinkButton from "../LinkButton";
import classnames from "classnames";
import {Extendable} from "../../../types";
import CopyIcon from "../../../components/CopyIcon";
import {useState} from "react";
import {CreateWalletStepProps} from "./index";

type PhraseDisplayProps = Extendable & {
  phrases: string[];
}

const PhraseDisplay = (props: PhraseDisplayProps) => {
  function renderPhraseCol(start: number, end: number) {
    return props.phrases.slice(start, end).map((p, index) => (
      <Typo.Small className={styles['phrase-item']}>{`${index + 1 + start}. ${p}`}</Typo.Small>
    ));
  }

  return (
    <div className={styles['phrase']}>
      <div>
        {renderPhraseCol(0, 6)}
      </div>
      <div className={'ml-[69px]'}>
        {renderPhraseCol(6, 12)}
      </div>
      <CopyIcon className={styles['icon-copy']}></CopyIcon>
    </div>
  )
}

const SavePhrase = (props: CreateWalletStepProps) => {
  const [phrases, setPhrases] = useState([
    'scrub',
    'slogan',
    'secret',
    'letter',
    'arrow',
    'forget',
    'betray',
    'mom',
    'often',
    'response',
    'fit',
    'camp'
  ]);

  return (
    <div className={styles['container']}>
      <Typo.Title className={
        classnames(
          styles['step-title'],
          'mt-[80px]'
        )
      }>Backup your wallet</Typo.Title>
      <section className={'mt-[45px] w-full px-[22px]'}>
        <PhraseDisplay phrases={phrases}></PhraseDisplay>
        <LinkButton
          to={'/settings'}
          theme={'primary'}
          className={classnames(
            styles['step-button'],
            'mt-[32px]'
          )}
          onClick={props.onNext}
        >
          I've saved the Phrase
        </LinkButton>
      </section>
    </div>
  )
}

export default SavePhrase;