import React from 'react';
import { View } from 'react-native';

import type { TxSummaryItemProps } from '@suiet/chrome-ext/src/components/tx-history/TxSummaryItem';
import type { TemplateIconType } from '@suiet/chrome-ext/src/components/tx-history/TemplateIcon';
import type { TemplateTextType } from '@suiet/chrome-ext/src/components/tx-history/TemplateText';

import Typography from '@/components/Typography';
import { Gray_900 } from '@/styles/colors';
import { TemplateIcon } from '@/screens/TxHistory/components/TemplateIcon';
import { TemplateText } from '@/screens/TxHistory/components/TemplateText';
import { resolveColor } from '@/screens/TxHistory/utils/color';
import { iconMap } from '@/screens/TxHistory/utils/iconMap';
import { SvgXml } from 'react-native-svg';

export const TxSummaryItem: React.FC<TxSummaryItemProps> = (props) => {
  // return (
  //   <div
  //     className={classNames(
  //       'flex',
  //       'items-center',
  //       styles['object-change-item'],
  //       props.className
  //     )}
  //   >
  //     <TemplateIcon
  //       className={classNames('z-[1]')}
  //       icon={props.icon}
  //       containerProps={{
  //         className: classNames(
  //           'w-[36px] h-[36px] shrink-0',
  //           props.iconContainerClassName
  //         ),
  //       }}
  //     />
  //     <div className={'ml-[16px] flex flex-col'}>
  //       <Typo.Title
  //         className={'text-medium font-semibold ellipsis  max-w-[140px]'}
  //       >
  //         {props.title}
  //       </Typo.Title>
  //       {props.desc && (
  //         <TemplateText
  //           value={props.desc}
  //           className={
  //             ' text-small ellipsis max-w-[140px] ' +
  //             getColorClassName(props?.changeDescColor)
  //           }
  //           type={descType}
  //         />
  //       )}
  //     </div>
  //     <div className={classNames('ml-auto flex flex-col items-end flex-1')}>
  //       <Typo.Normal
  //         className={classNames(
  //           'font-medium ellipsis max-w-[140px]',
  //           styles['change-title'],
  //           getColorClassName(changeTitleColor)
  //         )}
  //       >
  //         {safe(props?.changeTitle, '')}
  //       </Typo.Normal>
  //       <ChangeDesc icon={props.changeDescIcon}>{props.changeDesc}</ChangeDesc>
  //     </div>
  //   </div>
  // );

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TemplateIcon icon={props.icon as TemplateIconType} />
        <View style={{ marginLeft: 16 }}>
          <Typography.Label children={props.title} color={Gray_900} />
          {props.desc && (
            <TemplateText type={props.descType as TemplateTextType} value={props.desc} color={props.changeDescColor} />
          )}
        </View>
        <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
          <Typography.Label children={props.changeTitle} color={resolveColor(props.changeTitleColor)} />
          {props.changeDesc && props.changeDescIcon === 'History' ? (
            <View style={{ flexDirection: 'row' }}>
              <SvgXml width={14} height={14} xml={iconMap['History']!} />
              <Typography.Comment children={props.changeDesc} color={resolveColor(props.changeDescColor)} />
            </View>
          ) : (
            <Typography.Comment children={props.changeDesc} color={resolveColor(props.changeDescColor)} />
          )}
        </View>
      </View>
    </View>
  );
};
