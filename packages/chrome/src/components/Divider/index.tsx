import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Extendable } from '../../types';

export type DividerType = 'horizontal' | 'vertical';

export type DividerProps = Extendable & {
  type?: DividerType;
};

const Divider = (props: DividerProps) => {
  const { type = 'horizontal', ...restProps } = props;
  return (
    <div
      {...restProps}
      className={classnames(styles[`divider--${type}`], props.className)}
    ></div>
  );
};

export default Divider;
