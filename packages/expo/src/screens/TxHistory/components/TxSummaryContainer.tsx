import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import dayjs from 'dayjs';

import type { AvailableIcon } from '@suiet/chrome-ext/src/components/icons/Icon';
import type { TxSummaryContainerProps } from '@suiet/chrome-ext/src/components/tx-history/TxSummaryContainer';

import Typography from '@/components/Typography';
import { Gray_400, TailwindColor } from '@/styles/colors';
import { upperFirst } from 'lodash-es';
import { tailwindMap } from '@/styles/colors';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import { iconMap } from '../utils/iconMap';

function formatDatetime(timestamp: number) {
  dayjs.extend(LocalizedFormat);
  dayjs.extend(calendar);
  // return dayjs(timestamp).format('lll');
  return dayjs(timestamp).calendar(null, {
    sameElse: 'lll',
  });
}

export const TxSummaryContainer: React.FC<TxSummaryContainerProps> = ({
  timestamp,
  category,
  categoryIcon,
  categoryColor,
}) => {
  // return (
  //   <section
  //     className={classNames(styles['tx-summary-container'], props.className)}
  //     onClick={props.onClick}
  //   >
  //     <header className={classNames('flex items-center px-[16px]')}>
  //       <div className={'flex items-center'}>
  //         {categoryIcon && (
  //           // TODO: icon cannot change color
  //           <Icon
  //             className={classNames('text-small mr-[4px]')}
  //             icon={categoryIcon}
  //             stroke={'#7d89b0'}
  //           />
  //         )}
  //         <TemplateText
  //           type={'text'}
  //           value={category}
  //           className={classNames(
  //             'text-small font-medium ml-[3px]',
  //             categoryColor
  //           )}
  //         />
  //       </div>
  //       <div className={'ml-auto'}>
  //         <Typo.Small className={'text-gray-400 text-small font-medium'}>
  //           {formatDatetime(props.timestamp)}
  //         </Typo.Small>
  //       </div>
  //     </header>
  //     <main
  //       className={
  //         'mt-[8px] hover:bg-gray-50 hover:cursor-pointer transition-all'
  //       }
  //     >
  //       {isNonEmptyArray(props.children) ? (
  //         <div>{props.children}</div>
  //       ) : (
  //         props.children
  //       )}
  //     </main>
  //   </section>
  // );

  const color = categoryColor ? tailwindMap[categoryColor as TailwindColor] : Gray_400;
  const iconSvg = iconMap[categoryIcon as AvailableIcon];

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 8, flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {iconSvg && <SvgXml width={14} height={14} color={color} xml={iconSvg} />}
        <Typography.Comment color={color} children={upperFirst(category)} />

        <View style={{ marginLeft: 'auto' }}>
          <Typography.Comment color={Gray_400} children={formatDatetime(timestamp)} />
        </View>
      </View>
    </View>
  );
};
