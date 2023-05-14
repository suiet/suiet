import styles from './index.module.scss';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import { ReactComponent as LogoGrey } from '../../assets/icons/logo-grey.svg';
import { Icon } from '../../components/icons';
import { Extendable } from '../../types';

export type GuideLayoutProps = Extendable & {
  grayTitle?: string;
  blackTitle?: string;
  desc?: string;
};

const GuideLayout = (props: GuideLayoutProps) => {
  return (
    <div className={classnames(styles['main-page'])}>
      <Icon elClassName={styles['logo']} icon={<LogoGrey />} />
      <div className={styles['content']}>
        <div className={styles['header']}>
          <div className="mt-[32px]">
            {props.grayTitle && (
              <Typo.Title className={classnames(styles['suiet-title'])}>
                {props.grayTitle}
              </Typo.Title>
            )}
            {props.blackTitle && (
              <Typo.Title
                className={classnames(
                  styles['suiet-title'],
                  styles['suiet-title--black']
                )}
              >
                {props.blackTitle}
              </Typo.Title>
            )}
            {props.desc && (
              <Typo.Normal className={classnames(styles['suiet-desc'])}>
                {props.desc}
              </Typo.Normal>
            )}
          </div>
        </div>

        {props.children}
      </div>
    </div>
  );
};

export default GuideLayout;
