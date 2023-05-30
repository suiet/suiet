import React from 'react';
import { Extendable } from '../../types';
import * as TooltipRadix from '@radix-ui/react-tooltip';

export type TypoProps = Extendable & {
  message?: string;
  backgoroundColor?: string;
  textColor?: string;
  className?: string;
  onClick?: () => void;
};
export default function Tooltip(props: TypoProps) {
  return props.message ? (
    <TooltipRadix.Provider delayDuration={300}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger className={props.className}>
          {props.children}
        </TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content className="TooltipContent bg-gray-600 text-white px-4 py-2 rounded-xl break-words max-w-[240px] transition-all">
            {props.message}
            <TooltipRadix.Arrow className="TooltipArrow" color="#101828" />
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  ) : (
    <>{props.children}</>
  );
}
