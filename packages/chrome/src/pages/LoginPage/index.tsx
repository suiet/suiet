import styles from "./index.module.scss";
import {Link} from "react-router-dom";
import {Extendable} from "../../types";
import classnames from "classnames";
import Typo from "../../components/Typo";

type LinkButtonProps = Extendable & {
  to: string;
  type?: 'primary' | 'default';
}

const LinkButton = (props: LinkButtonProps) => {
  const {type = 'default'} = props;
  return (
    <Link to={props.to}>
      <div className={classnames(
        styles['link-btn'],
        styles[`link-btn--${type}`],
        props.className)}
      >{props.children}</div>
    </Link>
  )
}

const Welcome = () => {
  return (
    <div className={styles['main-page']}>
      <Typo.Title className={styles['suiet-title']}>Suiet</Typo.Title>
      <Typo.Normal className={styles['suiet-desc']}>The wallet for Everyone</Typo.Normal>
      <div className={'mt-[117px]'}>
        <LinkButton
          to={'/settings'}
          type={'primary'}
        >Create New</LinkButton>
        <LinkButton
          to={'/settings'}
          className={'mt-[16px]'
          }>Import Wallet</LinkButton>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Welcome />
  );
}
