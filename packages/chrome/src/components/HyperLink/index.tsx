import classnames from 'classnames';
import styles from './index.module.scss';
import Icon from '../Icon';
import { ReactComponent as IconLink } from '../../assets/icons/link.svg';
import Typo from '../Typo';
import { Extendable } from '../../types';

export type HyperLinkProps = Extendable & {
  url: string;
};

const HyperLink = (props: HyperLinkProps) => {
  return (
    <div
      className={classnames(styles['hyper-link'], props.className)}
      style={props.style}
    >
      <Icon icon={<IconLink />} className={styles['hyper-link__icon']} />
      <Typo.Normal className={styles['hyper-link__url']}>
        {props.url}
      </Typo.Normal>
    </div>
  );
};

export default HyperLink;
