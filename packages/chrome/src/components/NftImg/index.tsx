import styles from './index.module.scss';
import { Extendable } from '../../types';
import { nftImgUrl } from '../../utils/nft';
import classnames from 'classnames';
import { CSSProperties, useState } from 'react';
export type NftImgProps = Extendable & {
  src: string;
  alt?: string;
  thumbnailUrl?: string;
  elClassName?: string;
  elStyle?: CSSProperties;
};

const NftImg = (props: NftImgProps) => {
  const { src = '', alt = 'nft' } = props;
  const [loading, setLoading] = useState(true);
  // const setLoading = (boolean) => {};
  // const loading = true;
  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <div
      className={classnames(styles['nft-img-wrap'], props.className)}
      style={{
        ...props.style,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {props.thumbnailUrl ? (
        <>
          <img
            src={loading ? props.thumbnailUrl : src}
            alt={alt}
            className={classnames(styles['nft-img'], props.elClassName)}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              ...props.elStyle,
              display: loading ? 'none' : 'block',
            }}
          />

          <img
            src={props.thumbnailUrl}
            alt="Loading..."
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: loading ? 'block' : 'none',
            }}
          />
        </>
      ) : (
        <img
          src={nftImgUrl(src)}
          alt={alt}
          className={classnames(styles['nft-img'], props.elClassName)}
          style={props.elStyle}
        />
      )}
    </div>
  );
};

export default NftImg;
