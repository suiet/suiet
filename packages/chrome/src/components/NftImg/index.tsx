import styles from './index.module.scss';
import { Extendable } from '../../types';
import { nftImgUrl } from '../../utils/nft';
import classnames from 'classnames';
import { CSSProperties, useEffect, useState } from 'react';
import DefaultNftImg from '../../assets/icons/default-nft.png';

export type NftImgProps = Extendable & {
  src: string;
  alt?: string;
  thumbnailUrl?: string;
  elClassName?: string;
  elStyle?: CSSProperties;
};

const NftImg = (props: NftImgProps) => {
  const { src = '', alt = 'nft' } = props;

  const [imgSource, setImgSource] = useState(
    nftImgUrl(props.thumbnailUrl) ?? DefaultNftImg
  );

  useEffect(() => {
    if (!src) {
      setImgSource(DefaultNftImg);
      return;
    }

    const img = new Image();
    img.onload = (ev) => {
      setImgSource(nftImgUrl(src) as string);
    };
    img.onerror = (event) => {
      setImgSource(DefaultNftImg);
    };
    img.src = nftImgUrl(src) as string;
  }, [src]);

  return (
    <div
      className={classnames(styles['nft-img-wrap'], props.className)}
      style={{
        ...props.style,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <img
        src={imgSource}
        alt={alt}
        className={classnames(styles['nft-img'], props.elClassName)}
        style={props.elStyle}
      />
    </div>
  );
};

export default NftImg;
