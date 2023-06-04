import styles from './index.module.scss';
import classnames from 'classnames';
import { Extendable } from '../../types';
import React, { ReactElement, useState } from 'react';
import { AvatarPfp } from '@suiet/core';
import NftImg from '../NftImg';

export type AvatarProps = Extendable & {
  size?: 'md' | 'lg' | 'sm' | 'xl';
  model?: number | string;
  pfp?: AvatarPfp;
};

const Avatar = (props: AvatarProps) => {
  const { size = 'md' } = props;
  let _model = Number(props.model);
  _model = _model >= 1 && _model <= 4 ? _model : 1;

  if (props.pfp && props.pfp?.uri) {
    return (
      <NftImg
        src={props.pfp.uri}
        alt={'nft pfp'}
        className={classnames(
          styles['avatar'],
          styles['wrap'],
          styles[`size--${size}`],
          props.className
        )}
        style={props.style}
        elClassName={classnames(styles['avatar'], styles['pfp-img'])}
      />
    );
  }
  return (
    <div
      className={classnames(
        styles['avatar'],
        styles['wrap'],
        styles[`model--${_model}`],
        styles[`size--${size}`],
        props.className
      )}
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
      className: classnames(styles['avatar'], styles['with-favicon__avatar']),
    });
  }
  return (
    <div className={classnames(styles['avatar'], styles['with-favicon'])}>
      <div
        className={classnames(
          styles['avatar'],
          styles['with-favicon__favicon']
        )}
      >
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
          styles['avatar'],
          styles['with-favicon__avatar'],
          styles['with-favicon__avatar--float']
        ),
      })}
    </div>
  );
}

export default Avatar;
