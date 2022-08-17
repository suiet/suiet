import React from "react";
import classnames from "classnames";
import styles from "../../pages/MainPage/Dashboard/index.module.scss";
import IconCopy from "../../assets/icons/copy.svg";
import {Extendable} from "../../types";

const CopyIcon = (props: Extendable) => {
  return (
    <img
      {...props}
      src={IconCopy}
      alt="copy"
      className={classnames(
  'w-[10.8px] h-[10.8px] pointer',
        props.className
      )}
    />
  )
}

export default CopyIcon;