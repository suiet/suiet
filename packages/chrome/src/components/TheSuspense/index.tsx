import React, {ReactNode, Suspense} from 'react';
import {Extendable} from "../../types";

const TheSuspense = (props: Extendable) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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