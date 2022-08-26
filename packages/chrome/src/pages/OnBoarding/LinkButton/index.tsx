import React from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import styles from "./index.module.scss";
import {Extendable} from "../../../types";

type ButtonType = 'button' | 'submit' | 'link';

export type LinkButtonProps = Extendable & {
  theme?: 'primary' | 'default';
  type?: ButtonType;
  to?: string;
  onClick?: () => void;
};

const LinkButton = (props: LinkButtonProps) => {
  const {type = 'button', theme = 'default'} = props;

  const button = (
    <button
      type={type !== 'link' ? type : undefined}
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