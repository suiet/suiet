import React from "react";
import classnames from "classnames";
import {ReactComponent as IconCopy} from "../../assets/icons/copy.svg";
import {Extendable} from "../../types";
import styles from './index.module.scss';

const CopyIcon = (props: Extendable & {
  onClick?: () => void;
}) => {
  return (
    <IconCopy
      {...props}
      className={classnames(
        styles['icon-copy'],
        props.className
      )}
    />
  )
}

export default CopyIcon;