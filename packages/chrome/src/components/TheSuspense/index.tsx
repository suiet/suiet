import React, {ReactNode, Suspense} from 'react';
import {Spin} from "antd";
import {Extendable} from "../../types";

const TheSuspense = (props: Extendable) => {
  return (
    <Suspense fallback={<Spin />}>
      {props.children}
    </Suspense>
  );
};

export const withSus = (children: ReactNode) => {
  return (
    <TheSuspense>
      {children}
    </TheSuspense>
  )
}

export default TheSuspense;