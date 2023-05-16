import Typo from '../../Typo';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Extendable } from '../../../types';
import { TemplateIcon, TemplateIconType } from '../../../components/tx-history';
import TemplateText, { TemplateTextType } from '../../tx-history/TemplateText';
import { safe } from '@suiet/core';
import { Icon } from '../../icons';
import { AvailableIcon } from '../../icons/Icon';

export type ObjectChangeItemProps = Extendable & {
  title: string;
  desc?: string;
  descType?: TemplateTextType;
  icon: TemplateIconType | string;
  iconShape?: 'circle' | 'square';
  iconContainerColor?: 'gray' | 'blue' | 'purple' | 'red' | string;
  iconContainerClassName?: string;
  changeTitle: string;
  changeTitleColor: 'red' | 'green' | 'orange' | 'gray' | string;
  changeDesc?: string;
  changeDescType?: TemplateTextType;
  changeDescIcon?: AvailableIcon;
  changeDescColor?: string;
};

export type ChangeDescProps = Extendable & {
  icon?: AvailableIcon;
};

function ChangeDesc(props: ChangeDescProps) {
  const { icon = '', children } = props;
  if (!children) return null;
  if (typeof children !== 'string') return <>{children}</>;

  let node = (
    <Typo.Small
      className={classNames(
        'text-gray-400 text-small ellipsis max-w-[140px]',
        props.className
      )}
    >
      {children}
    </Typo.Small>
  );
  if (icon === 'History') {
    node = (
      <div className={'flex items-center'}>
        <Icon icon={'History'} className={'mr-[4px]'} />
        {node}
      </div>
    );
  }
  return node;
}

function getColorClassName(color: string | null | undefined) {
  if (!color) return 'text-gray-400';
  if (color.startsWith('text-')) return color;
  return `text-${color}-500`;
}

const ObjectChangeItem = (props: ObjectChangeItemProps) => {
  const { changeTitleColor = 'text-gray-400', descType = 'text' } = props;

  return (
    <div
      className={classNames(
        'flex',
        'items-center',
        styles['object-change-item'],
        props.className
      )}
    >
      <TemplateIcon
        className={classNames('z-[1]')}
        icon={props.icon}
        containerProps={{
          className: classNames(
            'w-[36px] h-[36px] shrink-0',
            props.iconContainerClassName
          ),
        }}
      />
      <div className={'ml-[16px] flex flex-col'}>
        <Typo.Title
          className={'text-medium font-semibold ellipsis  max-w-[140px]'}
        >
          {props.title}
        </Typo.Title>
        {props.desc && (
          <TemplateText
            value={props.desc}
            className={
              ' text-small ellipsis max-w-[140px] ' +
              getColorClassName(props?.changeDescColor)
            }
            type={descType}
          />
        )}
      </div>
      <div className={classNames('ml-auto flex flex-col items-end flex-1')}>
        <Typo.Normal
          className={classNames(
            'font-medium ellipsis max-w-[140px]',
            styles['change-title'],
            getColorClassName(changeTitleColor)
          )}
        >
          {safe(props?.changeTitle, '')}
        </Typo.Normal>
        <ChangeDesc icon={props.changeDescIcon}>{props.changeDesc}</ChangeDesc>
      </div>
    </div>
  );
};

export default ObjectChangeItem;
