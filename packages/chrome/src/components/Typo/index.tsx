import React from 'react';
import {Extendable} from "../../types";
import classnames from "classnames";
import styles from './index.module.scss';

export type TypoProps = Extendable & {

}

export const Title = (props: Extendable) => {
  return (
    <h1
      {...props}
      className={classnames(styles['title'], props.className)}
    />
  )
}

export const Normal = (props: TypoProps) => {
  return (
    <p
      {...props}
      className={classnames(
        styles['normal'],
        props.className
      )}
    />
  );
};

export default {
  Title,
  Normal
}