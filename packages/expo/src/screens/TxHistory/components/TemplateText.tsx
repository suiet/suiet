// import { Extendable } from '../../../types';
// import Address from '../../Address';
// import Typo from '../../Typo';
// import { ellipsis } from '@suiet/core';
// import { Icon } from '../../icons';
// import classNames from 'classnames';
// import CopyIcon from '../../CopyIcon';
// import Message from '../../message';

import React from 'react';
import type { TemplateTextType } from '@suiet/chrome-ext/src/components/tx-history/TemplateText';
import { addressEllipsis } from '@suiet/core/src/utils/format';

import { Gray_600, Gray_700 } from '@/styles/colors';
import Typography, { ColorProps } from '@/components/Typography';
import { resolveColor } from '../utils/color';

// export type TemplateTextType = 'text' | 'address' | 'ellipsis' | 'timestamp' | 'history';

// export type TemplateTextProps = Extendable & {
//   type?: TemplateTextType;
//   value: string;
// };

// const TemplateText = (props: TemplateTextProps) => {
//   const { type = 'text' } = props;
//   switch (type) {
//     case 'address':
//       return <Address value={props.value} className={props.className} style={props.style} />;
//     case 'ellipsis':
//       return (
//         <Typo.Normal className={classNames('flex items-center', props.className)} style={props.style}>
//           {ellipsis(props.value)}
//           <CopyIcon
//             className={'ml-[8px]'}
//             copyStr={props.value}
//             onCopied={() => {
//               Message.success('Copied');
//             }}
//           />
//         </Typo.Normal>
//       );
//     case 'timestamp':
//       return (
//         <Typo.Normal className={props.className} style={props.style}>
//           {new Date(Number(props.value)).toLocaleString()}
//         </Typo.Normal>
//       );
//     case 'history':
//       return (
//         <Typo.Small className={classNames('flex items-center', props.className)}>
//           <Icon icon={'History'} className={'mr-[4px]'} />
//           {props.value}
//         </Typo.Small>
//       );
//     default:
//       return (
//         <Typo.Normal className={props.className} style={props.style}>
//           {props.value}
//         </Typo.Normal>
//       );
//   }
// };

// export default TemplateText;

export const TemplateText: React.FC<{ type: TemplateTextType; value: string; color?: string }> = (props) => {
  const { type = 'text', value, color } = props;

  console.log(color);
  switch (type) {
    case 'address':
      return <Typography.Mono children={addressEllipsis(value)} color={resolveColor(color)} />;
    default:
      return <Typography.Comment children={value} color={resolveColor(color)} />;
  }
};
