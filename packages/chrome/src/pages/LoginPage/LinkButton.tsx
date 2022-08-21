import React from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import styles from "./LinkButton.module.scss";
import {Extendable} from "../../types";

export type LinkButtonProps = Extendable & {
  to: string;
  type?: 'primary' | 'default';
};

const LinkButton = (props: LinkButtonProps) => {
  const {type = 'default'} = props;
  return (
    <Link to={props.to} className={'w-full'}>
      <button className={classnames(
        styles['link-btn'],
        styles[`link-btn--${type}`],
        props.className)}
      >{props.children}</button>
    </Link>
  )
}

export default LinkButton;