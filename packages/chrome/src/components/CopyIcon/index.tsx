import React from "react";
import classnames from "classnames";
import {ReactComponent as IconCopy} from "../../assets/icons/copy.svg";
import {Extendable} from "../../types";
import styles from './index.module.scss';
import copy from "copy-to-clipboard";

const CopyIcon = (props: Extendable & {
  copyStr?: string;
  onClick?: () => void;
  onCopied?: () => void;
}) => {

  const handleClick = () => {
    if (props.onClick) return props.onClick();
    if (!props.copyStr) return;
    copy(props.copyStr);
    if (props.onCopied) props.onCopied();
  }

  return (
    <IconCopy
      {...props}
      onClick={handleClick}
      className={classnames(
        styles['icon-copy'],
        props.className
      )}
    />
  )
}

export default CopyIcon;