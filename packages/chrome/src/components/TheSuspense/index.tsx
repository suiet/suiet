import React, {ReactNode, Suspense} from 'react';
import {Extendable} from "../../types";
import FullPageLoading from "../Loading";

const TheSuspense = (props: Extendable) => {
  return (
    <Suspense fallback={<FullPageLoading />}>
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