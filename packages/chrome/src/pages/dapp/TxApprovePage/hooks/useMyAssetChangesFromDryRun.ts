import { useFeatureFlagsWithNetwork } from '../../../../hooks/useFeatureFlags';
import useDryRunTransactionBlock from '../../../../hooks/transaction/useDryRunTransactionBlock';
import { getEstimatedGasFeeFromDryRunResult } from '../../../../hooks/transaction/useEstimatedGasFee';
import { SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js';
import { DEFAULT_GAS_BUDGET } from '../../../../constants';
import { useEffect, useMemo, useState } from 'react';
import {
  AssetChangeAnalyzer,
  ICoinChangeObject,
  INftChangeObject,
  IObjectChangeObject,
} from '@suiet/core';
import { getDataOfObjects } from '../../../../hooks/query/useGetDataOfObjects';
import { useAsyncEffect } from 'ahooks';
import { useApiClient } from '../../../../hooks/useApiClient';
import { useNetwork } from '../../../../hooks/useNetwork';
import { useSelector } from 'react-redux';
import { getCoinMetadata } from '../../../../hooks/query/useGetCoinMetadata';

export default function useMyAssetChangesFromDryRun(
  address: string | undefined,
  transactionBlock: TransactionBlock | undefined
) {
  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasFee = BigInt(
    featureFlags?.move_call_gas_budget ?? DEFAULT_GAS_BUDGET
  );
  const apiClient = useApiClient();
  const { networkId } = useSelector((state: any) => state.appContext);
  const { data: network } = useNetwork(networkId);
  const { data: dryRunResult, ...rest } =
    useDryRunTransactionBlock(transactionBlock);

  const estimatedGasFee = getEstimatedGasFeeFromDryRunResult(
    dryRunResult,
    fallbackGasFee
  );

  const [coinChangeList, setCoinChangeList] = useState<ICoinChangeObject[]>([]);
  const [nftChangeList, setNftChangeList] = useState<INftChangeObject[]>([]);
  const [objectChangeList, setObjectChangeList] = useState<
    IObjectChangeObject[]
  >([]);

  useAsyncEffect(async () => {
    if (!dryRunResult || !address || !network) return;
    const analyzer = new AssetChangeAnalyzer(address);

    // provide additional information for objects (nft, coin)
    const objectDataMap: Record<string, any> = {};

    // try to get Coin metadata
    const coinTypes = dryRunResult.balanceChanges
      .filter((item) => {
        // exclude SUI, we know its decimals is 9
        return item.coinType !== SUI_TYPE_ARG;
      })
      .map((item) => item.coinType);
    const coinMetadata = await getCoinMetadata({
      apiClient,
      network,
      coinTypes,
    });
    for (let i = 0; i < coinTypes.length; i++) {
      const coinType = coinTypes[i];
      const res = coinMetadata[i];
      if (!res.data) continue;
      objectDataMap[coinType] = {
        decimals: res.data.decimals,
      };
    }

    // try to get NFT information
    const ownedObjectChanges = AssetChangeAnalyzer.filterOwnedObjectChanges(
      address,
      dryRunResult.objectChanges,
      {
        excludeCoin: true,
      }
    );
    const objectIds = ownedObjectChanges.map((item) => item.objectId);
    const res = await getDataOfObjects({
      apiClient,
      network,
      objectIds,
      options: {
        showDisplay: true,
        showType: true,
      },
    });
    for (let i = 0; i < objectIds.length; i++) {
      const objectId = objectIds[i];
      const item = res[i];
      if (!item.data || !item.data?.display?.data) continue;
      objectDataMap[objectId] = {
        display: item.data.display.data,
      };
    }

    analyzer.setBalanceChanges(dryRunResult.balanceChanges);
    analyzer.setObjectChanges(dryRunResult.objectChanges);
    analyzer.setObjectDataMap(objectDataMap);

    const analyzeResult = analyzer.getAnalyzedResult();

    setCoinChangeList(analyzeResult.getCoinChangeList());
    setNftChangeList(analyzeResult.getNftChangeList());
    setObjectChangeList(analyzeResult.getObjectChangeList());
  }, [dryRunResult, address, network]);

  console.log('dryRunResult', dryRunResult);
  console.log('coinChanges', coinChangeList);
  console.log('nftChanges', nftChangeList);
  console.log('objectChangeList', objectChangeList);

  return {
    data: {
      estimatedGasFee,
      coinChangeList,
      nftChangeList,
      objectChangeList,
    },
    ...rest,
  };
}
