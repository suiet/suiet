import { Extendable } from '../../types';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import ReactSkeleton from 'react-loading-skeleton';
import classnames from 'classnames';

export type DappCardProps = Extendable & {
  icon: string;
  name: string;
  desc: string;
  link: string;
  bgColor: string;
};

const DappCard = (props: DappCardProps) => {
  return (
    <a
      href={props.link}
      target={'_blank'}
      className={styles['dapp-card']}
      style={{ backgroundColor: props.bgColor }}
      rel="noreferrer"
    >
      <div>
        <img className={styles['dapp-card-icon']} src={props.icon} />
      </div>
      <Typo.Title className={styles['dapp-card-name']}>{props.name}</Typo.Title>
      <Typo.Normal className={styles['dapp-card-desc']}>
        {props.desc}
      </Typo.Normal>
    </a>
  );
};

export const Skeleton = (props: Extendable) => {
  return (
    <div className={props.className}>
      <ReactSkeleton className={classnames(styles['dapp-card-skeleton'])} />
    </div>
  );
};

export default DappCard;
