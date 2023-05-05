import { useMemo, useState } from 'react';
import { useFeatureFlagsWithNetwork } from '../useFeatureFlags';
import { DEFAULT_GAS_BUDGET } from '../../constants';
import { StateTuple } from '../../types';

export default function useGasBudgetWithFallback(): StateTuple<string> {
  const [gasBudget, setGasBudget] = useState<string>(String('0'));
  const featureFlags = useFeatureFlagsWithNetwork();

  const gasBudgetMemo = useMemo(() => {
    if (Number(gasBudget) > 0) return gasBudget;
    if (typeof featureFlags?.move_call_gas_budget === 'number') {
      return String(featureFlags.move_call_gas_budget);
    }
    return String(DEFAULT_GAS_BUDGET);
  }, [gasBudget, featureFlags]);

  return [gasBudgetMemo, setGasBudget];
}
