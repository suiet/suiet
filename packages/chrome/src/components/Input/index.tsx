import React, {CSSProperties, InputHTMLAttributes, ReactNode} from 'react';
import styles from "./index.module.scss";
import {Extendable} from "../../types";
import classnames from "classnames";
import IconInputSuccess from '../../assets/icons/input-success.svg';
import IconInputFail from '../../assets/icons/input-fail.svg';

type State = 'success' | 'error' | 'default';

export type InputProps = Extendable & InputHTMLAttributes<HTMLElement> & {
  state?: State;
  elClassName?: string;
  elStyle?: CSSProperties;
  suffix?: ReactNode;
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
}

export const InputGroup = (props: InputProps) => {
  const {
    state = 'default',
    children,
    className,
    elClassName,
    suffix,
    ...restProps
  } = props;
  return (
    <div className={classnames(
      styles['input-group'],
      { [styles[`input-group-state--${state}`]]: state !== 'default' },
      props.className,
    )}>
      <Input
        {...restProps}
        state={state}
        className={'flex-1'}
        elClassName={classnames(
          styles['input--no-border'],
          props.elClassName
        )}
      />
      {suffix && (<div className={
        classnames(
          styles['input-suffix'],
          { [styles[`input-suffix-state--${state}`]]: state !== 'default' },
        )
      }>{suffix}</div>)}
    </div>
  )
}

function hasState(state: State) {
  return state !== 'default';
}

const Input = (props: InputProps) => {
  const {
    state = 'default',
    className,
    style,
    elClassName,
    elStyle,
    ...inputProps
  } = props;
  const stateMetrics = stateMap[state] || stateMap['default'];

  return (
    <div
      className={classnames(styles['input-wrapper'], className)}
      style={style}
    >
      <input
        {...inputProps}
        className={
          classnames(styles['input'],
            hasState(state) ? [
            styles['input-state'],
            styles[`input-state--${state}`],
          ] : '',
          elClassName
        )}
        style={elStyle}
      >
      </input>
      {hasState(state) && (
        <div className={styles['icon']}>
          <img src={stateMetrics.icon} alt={stateMetrics.alt} />
        </div>
      )}
    </div>
  );
};

export default Input;