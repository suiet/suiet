import * as React from 'react';

export function useSkipFirstEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    effect();
  }, deps);
}
