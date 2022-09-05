import React from 'react';
import { Extendable } from '../../types';
import classnames from 'classnames';
import styles from './index.module.scss';

export type TypoProps = Extendable & {
  onClick?: () => void;
};

export const Title = (props: Extendable) => {
  return (
    <h1 {...props} className={classnames(styles['title'], props.className)} />
  );
};

export const Normal = (props: TypoProps) => {
  return (
    <p {...props} className={classnames(styles['normal'], props.className)} />
  );
};

export const Small = (props: TypoProps) => {
  return (
    <p {...props} className={classnames(styles['small'], props.className)} />
  );
};

export const Hints = (props: Extendable & { state?: 'default' | 'error' }) => {
  const { state = 'default', ...restProps } = props;
  return (
    <small
      {...restProps}
      className={classnames(
        styles['hints'],
        state ? styles[`hints--${state}`] : '',
        props.className
      )}
    ></small>
  );
};

export default {
  Title,
  Normal,
  Small,
  Hints,
};
