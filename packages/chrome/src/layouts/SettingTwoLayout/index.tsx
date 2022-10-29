import styles from './index.module.scss';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import { Extendable } from '../../types';

export type SettingTwoLayoutProps = Extendable & {
  title: string;
  desc?: string;
};

const SettingTwoLayout = (props: SettingTwoLayoutProps) => {
  return (
    <div
      className={classnames(styles['container'], props.className)}
      style={props.style}
    >
      <Typo.Title className={styles['title']}>{props.title}</Typo.Title>
      {props.desc && (
        <Typo.Normal className={styles['desc']}>{props.desc}</Typo.Normal>
      )}
      {props.children}
    </div>
  );
};

export default SettingTwoLayout;
