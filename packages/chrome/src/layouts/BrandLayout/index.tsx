import styles from './index.module.scss';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import { ReactComponent as LogoGrey } from '../../assets/icons/logo-grey.svg';
import Icon from '../../components/Icon';
import { Extendable } from '../../types';

export type BrandLayoutProps = Extendable & {
  grayTitle: string;
  blackTitle: string;
  desc: string;
};

const BrandLayout = (props: BrandLayoutProps) => {
  return (
    <div className={classnames(styles['main-page'])}>
      <Icon elClassName={styles['logo']} icon={<LogoGrey />} />
      <Typo.Title className={classnames(styles['suiet-title'], 'mt-[64px]')}>
        {props.grayTitle}
      </Typo.Title>
      <Typo.Title
        className={classnames(
          styles['suiet-title'],
          styles['suiet-title--black']
        )}
      >
        {props.blackTitle}
      </Typo.Title>
      <Typo.Normal className={classnames(styles['suiet-desc'])}>
        {props.desc}
      </Typo.Normal>
      {props.children}
    </div>
  );
};

export default BrandLayout;
