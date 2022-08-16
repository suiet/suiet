import React, {CSSProperties, TextareaHTMLAttributes} from 'react';
import styles from "./index.module.scss";
import {Extendable} from "../../types";
import classnames from "classnames";
import IconInputSuccess from '../../assets/icons/input-success.svg';
import IconInputFail from '../../assets/icons/input-fail.svg';

export type TextareaProps = Extendable & TextareaHTMLAttributes<HTMLElement> & {
  state?: 'success' | 'fail';
  elClassName?: string;
  elStyle?: CSSProperties;
};

const stateMap = {
  success: {
    icon: IconInputSuccess,
    alt: 'success',
  },
  fail: {
    icon: IconInputFail,
    alt: 'fail',
  },
  default: {
    icon: '',
    alt: '',
  },
}

const Textarea = (props: TextareaProps) => {
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
        className={
          classnames(styles['textarea'],
          state ? [
            styles['textarea-state'],
            styles[`textarea-state--${state}`],
          ] : '',
          elClassName
        )}
        style={elStyle}
      >
      </textarea>
      {state && (
        <div className={styles['icon']}>
          <img src={stateMetrics.icon} alt={stateMetrics.alt} />
        </div>
      )}
    </div>
  );
};

export default Textarea;