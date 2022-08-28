import React, {CSSProperties, useCallback} from "react";
import classnames from "classnames";
import {ReactComponent as IconCopy} from "../../assets/icons/copy.svg";
import {Extendable} from "../../types";
import styles from './index.module.scss';
import copy from "copy-to-clipboard";

const CopyIcon = (props: Extendable & {
  copyStr?: string;
  onClick?: () => void;
  onCopied?: () => void;
  elClassName?: string;
  elStyle?: CSSProperties;
}) => {
  const {copyStr = '', onCopied, onClick} = props;

  const handleClick = useCallback(() => {
    if (onClick) return onClick();
    if (!copyStr) return;
    copy(copyStr);
    if (onCopied) onCopied();
  }, [copyStr, onCopied, onClick]);

  return (
    <div
      onClick={handleClick}
      className={props.className}
      style={props.style}
    >
      <IconCopy
        className={classnames(
          styles['icon-copy'],
          props.elClassName
        )}
        style={props.elStyle}
      />
    </div>
  )
}

export default CopyIcon;