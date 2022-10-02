import React from 'react';
import { Extendable } from '../../types';
import classnames from 'classnames';
import styles from './index.module.scss';

export type TypoProps = Extendable & {
  ellipsis?: boolean;
  onClick?: () => void;
};

const createTypo = (
  el: JSX.Element,
  props: TypoProps,
  textClassname: string
) => {
  const { ellipsis, ...restProps } = props;
  return React.cloneElement(el, {
    ...restProps,
    title: typeof props.children === 'string' ? props.children : undefined,
    className: classnames(
      textClassname,
      {
        [styles['ellipsis']]: ellipsis,
      },
      restProps.className
    ),
  });
};

export const Title = (props: TypoProps) => {
  return createTypo(<h1 />, props, classnames(styles['title']));
};

export const Normal = (props: TypoProps) => {
  return createTypo(<p />, props, classnames(styles['normal']));
};

export const Small = (props: TypoProps) => {
  return createTypo(<small />, props, classnames(styles['small']));
};

export const Hints = (props: Extendable & { state?: 'default' | 'error' }) => {
  const { state = 'default', ...restProps } = props;
  return createTypo(
    <small />,
    restProps,
    classnames(styles['hints'], state ? styles[`hints--${state}`] : '')
  );
};

export default {
  Title,
  Normal,
  Small,
  Hints,
};
