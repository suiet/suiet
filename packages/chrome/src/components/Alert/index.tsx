import styles from './index.module.scss';
import { Extendable } from '../../types';
import classnames from 'classnames';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export type AlertProps = Extendable & {
  type?: 'default' | 'warn' | 'error';
  title?: string;
};

const Alert = (props: AlertProps) => {
  const { type = 'default' } = props;
  const color = type === 'warn' ? 'orange' : type === 'error' ? 'red' : 'blue';
  return (
    <div
      className={classnames(
        'rounded-lg p-[4px]',
        `bg-${color}-50`,
        props.className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type !== 'default' && (
            <div
              className={classnames(
                `bg-${color}-600`,
                'px-[10px]',
                'py-[2px]',
                'text-white',
                'rounded-lg'
              )}
            >
              {type}
            </div>
          )}
        </div>
        <div className="ml-3 mt-[2px]">
          {props.title && (
            <h3 className={`text-sm mb-2 font-medium text-${color}-800`}>
              {props.title}
            </h3>
          )}
          <div className={classnames(`text-sm text-${color}-700`, 'break-all')}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
