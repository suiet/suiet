import styles from './index.module.scss';
import { Extendable } from '../../types';
import { nftImgUrl } from '../../utils/nft';
import classnames from 'classnames';
import { CSSProperties } from 'react';

export type NftImgProps = Extendable & {
  src: string;
  alt?: string;
  elClassName?: string;
  elStyle?: CSSProperties;
};

const NftImg = (props: NftImgProps) => {
  const { src = '', alt = 'nft' } = props;
  return (
    <div
      className={classnames(styles['nft-img-wrap'], props.className)}
      style={props.style}
    >
      <img
        src={nftImgUrl(src)}
        alt={alt}
        className={classnames(styles['nft-img'], props.elClassName)}
        style={props.elStyle}
      />
    </div>
  );
};

export default NftImg;
