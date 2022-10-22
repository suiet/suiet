import { Extendable } from '../../types';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import styles from './index.module.scss';
import { DappItem } from '../../api/dapps';
import { startCase } from 'lodash-es';
import DappMediaItem, {
  Skeleton as DappMediaItemSkeleton,
} from './DappMediaItem';
import ReactSkeleton from 'react-loading-skeleton';

export type DappSectionProps = Extendable & {
  title: string;
  dapps: DappItem[] | undefined;
};

const DappSection = (props: DappSectionProps) => {
  const { title = 'Title', dapps = [] } = props;
  return (
    <section className={classnames(styles['dapp-section'], props.className)}>
      <Typo.Title className={styles['dapp-section-title']}>
        {startCase(title)}
      </Typo.Title>
      <div className={'mt-[4px]'}>
        {dapps.map((dapp) => {
          return (
            <DappMediaItem
              key={dapp.id}
              name={dapp.name}
              desc={dapp.description}
              icon={dapp.icon}
              link={dapp.link}
            />
          );
        })}
      </div>
    </section>
  );
};

export const Skeleton = (props: Extendable) => {
  return (
    <section className={classnames(styles['dapp-section'], props.className)}>
      <div className={'px-[24px]'}>
        <ReactSkeleton width={'80px'} height={'24px'} />
      </div>
      <div className={'mt-[4px]'}>
        <DappMediaItemSkeleton />
      </div>
    </section>
  );
};

export default DappSection;
