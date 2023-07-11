import Typo from '../../Typo';
import { Extendable } from '../../../types';
import classNames from 'classnames';
import { isNonEmptyArray } from '@suiet/core';
import styles from './index.module.scss';
import { Icon } from '../../icons';
import { formatDatetime } from '../../../utils/formatDatetime';
import TemplateText from '../TemplateText';
export type TxSummaryContainerProps = {
  timestamp: number;
  category?: string;
  categoryIcon?: string;
  categoryColor?: string;
  onClick?: () => void;
};

const TxSummaryContainer = (props: Extendable & TxSummaryContainerProps) => {
  const {
    category = 'Category',
    categoryIcon = 'Down',
    categoryColor = 'text-gray-400',
  } = props;
  return (
    <section
      className={classNames(styles['tx-summary-container'], props.className)}
      onClick={props.onClick}
    >
      <header className={classNames('flex items-center px-[16px]')}>
        <div className={'flex items-center'}>
          {categoryIcon && (
            // TODO: icon cannot change color
            <Icon
              className={classNames('text-small mr-[4px]')}
              icon={categoryIcon}
              stroke={'#7d89b0'}
            />
          )}
          <TemplateText
            type={'text'}
            value={category}
            className={classNames(
              'text-small font-medium ml-[3px]',
              categoryColor
            )}
          />
        </div>
        <div className={'ml-auto'}>
          <Typo.Small className={'text-gray-400 text-small font-medium'}>
            {formatDatetime(props.timestamp)}
          </Typo.Small>
        </div>
      </header>
      <main
        className={
          'mt-[8px] hover:bg-gray-50 hover:cursor-pointer transition-all'
        }
      >
        {isNonEmptyArray(props.children) ? (
          <div>{props.children}</div>
        ) : (
          props.children
        )}
      </main>
    </section>
  );
};

export default TxSummaryContainer;
