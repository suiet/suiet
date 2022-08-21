import React from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import styles from "./index.module.scss";
import {Extendable} from "../../../types";

export type LinkButtonProps = Extendable & {
  theme?: 'primary' | 'default';
  type?: 'button' | 'link';
  to?: string;
  onClick?: () => void;
};

const LinkButton = (props: LinkButtonProps) => {
  const {type = 'default', theme = 'default'} = props;

  const button = (
    <button
      onClick={props.onClick}
      className={classnames(
      styles['link-btn'],
      styles[`link-btn--${theme}`],
      props.className)}
    >{props.children}</button>
  );

  if (type === 'link') {
    return (
      <Link to={props.to || ''} className={'w-full'}>
        {button}
      </Link>
    )
  }
  return button;
}

export default LinkButton;