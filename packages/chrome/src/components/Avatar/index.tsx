import styles from './index.module.scss';
import classnames from 'classnames';
import { Extendable } from '../../types';
import React, { ReactElement, ReactNode, useState } from 'react';

export type AvatarProps = Extendable & {
  size?: 'md' | 'lg' | 'sm';
  model?: number | string;
};

const Avatar = (props: AvatarProps) => {
  const { size = 'md' } = props;
  let _model = Number(props.model);
  _model = _model >= 1 && _model <= 4 ? _model : 1;

  return (
    <div
      className={classnames(styles['avatar'], [
        styles[`avatar-size--${size}`],
        styles[`avatar-model--${_model}`],
        props.className,
      ])}
      style={props.style}
    ></div>
  );
};

export function withFavicon(
  avatar: ReactElement,
  props: { src: string; alt?: string }
) {
  const [imgError, setImgError] = useState(false);
  if (!props.src || imgError) {
    return React.cloneElement(avatar, {
      className: styles['with-favicon__avatar'],
    });
  }
  return (
    <div className={styles['with-favicon']}>
      <div className={styles['with-favicon__favicon']}>
        <img
          src={props.src}
          alt={props?.alt}
          onError={() => {
            setImgError(true);
          }}
        />
      </div>
      {React.cloneElement(avatar, {
        className: classnames(
          styles['with-favicon__avatar'],
          styles['with-favicon__avatar--float']
        ),
      })}
    </div>
  );
}

export default Avatar;
