import React, { CSSProperties, TextareaHTMLAttributes } from 'react';
import styles from './index.module.scss';
import { Extendable } from '../../types';
import classnames from 'classnames';
import IconInputSuccess from '../../assets/icons/input-success.svg';
import IconInputFail from '../../assets/icons/input-fail.svg';
import { InputState } from '../Input';

export type TextareaProps = Extendable &
  TextareaHTMLAttributes<HTMLElement> & {
    state?: InputState;
    elClassName?: string;
    elStyle?: CSSProperties;
  };

const stateMap = {
  success: {
    icon: IconInputSuccess,
    alt: 'success',
  },
  error: {
    icon: IconInputFail,
    alt: 'error',
  },
  default: {
    icon: '',
    alt: '',
  },
};

function hasInputState(state: InputState) {
  return state !== 'default';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      state = 'default',
      className,
      style,
      elClassName,
      elStyle,
      ...textareaProps
    } = props;
    const stateMetrics = stateMap[state] || stateMap['default'];

    return (
      <div
        className={classnames(styles['textarea-wrapper'], className)}
        style={style}
      >
        <textarea
          {...textareaProps}
          ref={ref}
          className={classnames(
            styles['textarea'],
            hasInputState(state)
              ? [styles['textarea-state'], styles[`textarea-state--${state}`]]
              : '',
            elClassName
          )}
          style={elStyle}
        ></textarea>
        {hasInputState(state) && (
          <div className={styles['icon']}>
            <img src={stateMetrics.icon} alt={stateMetrics.alt} />
          </div>
        )}
      </div>
    );
  }
);

export default Textarea;
