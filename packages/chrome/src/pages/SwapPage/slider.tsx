import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

import { Extendable } from '../../types';
import classNames from 'classnames';
import Tooltip from '../../components/Tooltip';

type SliderProps = Extendable & {
  value: number;
  max: number;
  onChange?: (value: number) => void;
};
export default function Slider(props: SliderProps) {
  const [isThumbActive, setIsThumbActive] = React.useState(false);
  return (
    <RadixSlider.Root
      className={classNames(
        'relative flex items-center select-none',
        props.className
      )}
      // defaultValue={[50]}
      value={[props.value]}
      onValueChange={(value) => {
        props.onChange?.(value[0]);
      }}
      min={0}
      max={props.max}
      // max={100}
      step={props.max / 1000}

      // minStepsBetweenThumbs={100}
    >
      <RadixSlider.Track className="bg-gray-300 relative flex-grow rounded-full h-0.5">
        <RadixSlider.Range className="absolute bg-blue-400 rounded-full h-full" />
      </RadixSlider.Track>

      <RadixSlider.Thumb
        className="focus:outline-none"
        onClick={() => {
          // console.log('click');
          // setIsThumbActive(true);
        }}
        onPointerDown={() => setIsThumbActive(true)}
        onPointerUp={() => setIsThumbActive(false)}
      >
        <Tooltip
          triggerAsChild
          delayDuration={1}
          open={isThumbActive}
          className="block transition w-5 h-5 bg-zinc-50 rounded-full border-[1.5px] border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 outline-none"
          message={((props.value / props.max) * 100).toLocaleString() + '%'}
        >
          <span className="block transition w-5 h-5 bg-zinc-50 rounded-full border-[1.5px] border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 outline-none"></span>
        </Tooltip>
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
}
