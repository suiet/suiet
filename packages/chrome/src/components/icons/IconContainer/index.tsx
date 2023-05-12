import styles from './index.module.scss';
import classNames from 'classnames';
import { Extendable } from '../../../types';
import { CSSProperties } from 'react';

export type IconContainerProps = Extendable & {
  shape?: 'circle' | 'square';
  color?: 'gray' | 'blue' | 'purple' | 'red' | 'transparent' | string;
};

export type ColorType = 'builtin' | 'custom' | 'tailwindcss';

function colorType(color: string): ColorType {
  if (!color) return 'builtin';
  if (color.startsWith('text-') || color.startsWith('bg-'))
    return 'tailwindcss';
  if (color.startsWith('#') || color.startsWith('rgb')) return 'custom';
  return 'builtin';
}

function getColorCss(color: string) {
  const colorStyle: CSSProperties = {};
  let colorClassName: string = '';
  const _colorType = colorType(color);
  if (_colorType === 'custom') {
    colorStyle['backgroundColor'] = color;
  } else if (_colorType === 'tailwindcss') {
    colorClassName = color;
  } else {
    colorClassName = styles[`icon-container--${color}`];
  }
  return { colorStyle, colorClassName };
}

const IconContainer = (props: IconContainerProps) => {
  const { shape = 'square', color = 'blue' } = props;

  const { colorClassName, colorStyle } = getColorCss(color);

  return (
    <div
      className={classNames(
        styles['icon-container'],
        styles[`icon-container--${shape}`],
        colorClassName,
        props.className
      )}
      style={colorStyle}
    >
      {props.children}
    </div>
  );
};

export default IconContainer;
