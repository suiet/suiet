import React from 'react';
import classnames from "classnames";
import styles from './index.module.scss';
import {Extendable} from "../../types";

export type ButtonState = 'normal' | 'primary' | 'danger';

export type ButtonProps = Extendable & {
  type?: 'button' | 'submit' | 'reset';
  state?: ButtonState;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  const {state = 'normal', ...restProps} = props;
  return (
    <button
      {...restProps}
      className={
        classnames(
          styles['button'],
          {[styles[`button--${state}`]]: state !== 'normal'},
          props.className
        )
      }
    ></button>
  );
};

export default Button;