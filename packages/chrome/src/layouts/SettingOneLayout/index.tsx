import styles from './index.module.scss';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import { Extendable } from '../../types';

export type SettingOneLayoutProps = Extendable & {
  titles: string[];
  desc: string;
};

const SettingOneLayout = (props: SettingOneLayoutProps) => {
  return (
    <div
      className={classnames(styles['container'], props.className)}
      style={props.style}
    >
      <Typo.Title className={styles['title']}>
        {props.titles.map((title, index) => (
          <span key={title + index}>
            {title}
            <br />
          </span>
        ))}
      </Typo.Title>
      <Typo.Normal className={styles['desc']}>{props.desc}</Typo.Normal>
      {props.children}
    </div>
  );
};

export default SettingOneLayout;
