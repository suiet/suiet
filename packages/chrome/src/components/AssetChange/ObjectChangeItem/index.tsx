import Typo, { Normal } from '../../Typo';
import Address from '../../Address';
import { ReactComponent as IconObject } from '../svg/object.svg';
import { ReactComponent as IconSui } from '../svg/sui.svg';
import { ReactComponent as IconCoin } from '../svg/coin.svg';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Extendable } from '../../../types';
import IconContainer from '../IconContainer';
import { nftImgUrl } from '../../../utils/nft';

export type ObjectChangeItemProps = Extendable & {
  title: string;
  desc?: string;
  icon: 'object' | 'sui' | 'coin' | string;
  iconShape?: 'circle' | 'square';
  iconColor?: 'gray' | 'blue' | 'purple';
  changeTitle: string;
  changeDesc?: string;
  changeTitleColor: 'red' | 'green' | 'orange' | 'gray';
};

const iconMap = new Map([
  ['object', <IconObject />],
  ['sui', <IconSui />],
  ['coin', <IconCoin />],
]);

const ObjectChangeItem = (props: ObjectChangeItemProps) => {
  const {
    iconShape = 'square',
    iconColor = 'gray',
    changeTitleColor = 'gray',
  } = props;

  const renderIcon = (icon: string) => {
    if (iconMap.has(icon)) {
      return iconMap.get(icon);
    }
    if (icon.startsWith('http') || icon.startsWith('ipfs')) {
      return <img src={nftImgUrl(icon)} />;
    }
    return iconMap.get('object'); // default icon
  };

  return (
    <div
      className={classNames(
        'flex',
        'items-center',
        styles['object-change-item'],
        props.className
      )}
    >
      <IconContainer
        className="w-[36px] h-[36px] shrink-0"
        shape={iconShape}
        color={iconColor}
      >
        {renderIcon(props.icon)}
      </IconContainer>
      <div className={'ml-[16px]'}>
        <Typo.Title className={styles['title']}>{props.title}</Typo.Title>
        {props.desc && (
          <div>
            <Address className={styles['desc']} value={props.desc} />
          </div>
        )}
      </div>
      <div className={classNames('ml-auto')} style={{ fontFamily: 'Inter' }}>
        <Typo.Normal
          className={classNames(
            'font-medium',
            'whitespace-nowrap',
            'overflow-x-auto',
            'text-right',
            styles['change-title'],
            styles[`change-title--${changeTitleColor}`]
          )}
        >
          {props.changeTitle.toUpperCase()}
        </Typo.Normal>
        {props.changeDesc && <Typo.Small>{props.changeDesc}</Typo.Small>}
      </div>
    </div>
  );
};

export default ObjectChangeItem;
