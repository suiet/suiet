import React, { ReactNode, Suspense } from 'react';
import { Extendable } from '../../types';
import LoadingPage from '../../pages/LoadingPage';

const TheSuspense = (props: Extendable) => {
  return <Suspense fallback={<LoadingPage />}>{props.children}</Suspense>;
};

export const withSus = (children: ReactNode) => {
  return <TheSuspense>{children}</TheSuspense>;
};

export default TheSuspense;
