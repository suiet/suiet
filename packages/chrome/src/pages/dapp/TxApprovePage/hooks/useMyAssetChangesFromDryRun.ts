import { dryRunTransactionBlock } from '../../../../hooks/transaction/useDryRunTransactionBlock';
import {
  DryRunTransactionBlockResponse,
  getTotalGasUsed,
  SUI_TYPE_ARG,
  TransactionBlock,
} from '@mysten/sui.js';
import { useState } from 'react';
import {
  AssetChangeAnalyzer,
  IAssetChangeOutput,
  ICoinChangeObject,
  INftChangeObject,
  IObjectChangeObject,
  Network,
} from '@suiet/core';
import { getDataOfObjects } from '../../../../hooks/query/useGetDataOfObjects';
import { useAsyncEffect } from 'ahooks';
import { useApiClient } from '../../../../hooks/useApiClient';
import { useNetwork } from '../../../../hooks/useNetwork';
import { useSelector } from 'react-redux';
import { getCoinMetadata } from '../../../../hooks/query/useGetCoinMetadata';
import { queryGasBudgetFromDryRunResult } from '../../../../hooks/transaction/useGasBudgetFromDryRun';
import { BackgroundApiClient } from '../../../../scripts/shared/ui-api-client';
import useGasBudgetWithFallback from '../../../../hooks/transaction/useGasBudgetWithFallback';

async function analyzeAssetChanges(
  accountAddress: string,
  dryRunResult: DryRunTransactionBlockResponse,
  apiClient: BackgroundApiClient,
  network: Network
) {
  const analyzer = new AssetChangeAnalyzer(accountAddress);

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
    accountAddress,
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

  return analyzer.getAnalyzedResult();
}

export default function useMyAssetChangesFromDryRun(
  accountAddress: string | undefined,
  transactionBlock: TransactionBlock | undefined
) {
  const apiClient = useApiClient();
  const { walletId, accountId, networkId } = useSelector(
    (state: any) => state.appContext
  );
  const { data: network } = useNetwork(networkId);

  const [coinChangeList, setCoinChangeList] = useState<ICoinChangeObject[]>([]);
  const [nftChangeList, setNftChangeList] = useState<INftChangeObject[]>([]);
  const [objectChangeList, setObjectChangeList] = useState<
    IObjectChangeObject[]
  >([]);
  const [estimatedGasFee, setEstimatedGasFee] = useState<string>('0');
  const [gasBudget, setGasBudget] = useGasBudgetWithFallback();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Only dry run once within a period of time
  useAsyncEffect(async () => {
    if (!transactionBlock || !accountAddress || !network) return;

    let analyzeResult: IAssetChangeOutput;
    let gasBudgetResult: string;
    let estimatedGasFeeResult: string;

    setLoading(true);
    try {
      const dryRunResult = await dryRunTransactionBlock({
        apiClient,
        context: {
          network,
          walletId,
          accountId,
        },
        transactionBlock,
      });
      estimatedGasFeeResult = String(
        getTotalGasUsed(dryRunResult.effects) ?? 0
      );

      gasBudgetResult = await queryGasBudgetFromDryRunResult({
        apiClient,
        network,
        dryRunResult,
      });

      analyzeResult = await analyzeAssetChanges(
        accountAddress,
        dryRunResult,
        apiClient,
        network
      );
    } catch (e: any) {
      setError(e);
      return;
    } finally {
      setLoading(false);
    }

    let coinChangeList = analyzeResult.getCoinChangeList();
    coinChangeList = coinChangeList.map((coinChange) => {
      if (coinChange.coinType === SUI_TYPE_ARG) {
        // exclude gas fee for SUI changes
        coinChange.amount = String(
          BigInt(coinChange.amount) + BigInt(estimatedGasFeeResult)
        );
        return coinChange;
      }
      return coinChange;
    });
    setCoinChangeList(coinChangeList);
    setNftChangeList(analyzeResult.getNftChangeList());
    setObjectChangeList(analyzeResult.getObjectChangeList());

    setEstimatedGasFee(estimatedGasFeeResult);

    // if gas budget is set in transaction block, use it
    if (transactionBlock.blockData.gasConfig.budget) {
      setGasBudget(String(transactionBlock.blockData.gasConfig.budget));
    } else {
      setGasBudget(gasBudgetResult);
    }
  }, [transactionBlock, accountAddress, network]);

  return {
    loading,
    error,
    data: {
      coinChangeList,
      nftChangeList,
      objectChangeList,
      estimatedGasFee,
      gasBudget,
    },
  };
}
