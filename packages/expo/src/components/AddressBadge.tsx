import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/client';
import { isValidSuiAddress } from '@mysten/sui.js';

import { Badge } from '@/components/Badge';
import { LoadingDots } from '@/components/Loading';
import { Label } from '@/components/Label';
import { SvgLinkExternal01 } from '@/components/icons/svgs';
import { GET_TRANSACTIONS, TransactionsFilter, TransactionsResult } from '@/utils/gql';
import { useFeatureFlags } from '@suiet/chrome-ext/src/hooks/useFeatureFlags';

export interface AddressBadgeProps {
  address: string;
}

type Data = {
  transactions: TransactionsResult;
};

type Variables = {
  filter?: Partial<TransactionsFilter>;
  cursor?: string;
  limit?: number;
  order?: 'ASC' | 'DESC';
};

export const AddressBadge: React.FC<AddressBadgeProps> = ({ address }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const featureFlags = useFeatureFlags();
  const { data, loading, error } = useQuery<Data, Variables>(GET_TRANSACTIONS, {
    variables: {
      filter: {
        toAddress: address,
        startTime: now - 1000 * 60 * 60 * 24 * 7,
        endTime: now,
      },
      limit: 99,
      order: 'DESC',
    },
    fetchPolicy: 'no-cache',
  });

  if (!isValidSuiAddress(address)) {
    return <Badge title="Invalid address" variant="error" />;
  }

  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 32,
        }}
      >
        <LoadingDots />
      </View>
    );
  }

  if (!featureFlags || error || !data) {
    return <Badge title="Failed to load transactions" variant="error" />;
  }

  const {
    transactions: { transactions, nextCursor },
  } = data;

  if (Array.isArray(transactions)) {
    if (transactions.length === 0) {
      return <Badge title="No recent transactions" variant="warning" />;
    } else {
      const numberOfTransactions = `${transactions?.length || 0}${nextCursor ? '+' : ''}`;

      const network = featureFlags.networks?.[featureFlags.default_network];

      return (
        <Badge
          variant="info"
          title={`${numberOfTransactions} transactions in 1 week`}
          rightLabel={
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`https://explorer.sui.io/address/${address}`);
              }}
            >
              <Label title="View" rightIconSvg={SvgLinkExternal01} />
            </TouchableOpacity>
          }
        />
      );
    }
  } else if (transactions === null) {
    return <Badge title="No transiations in this address" variant="warning" />;
  } else {
    return <Badge title="Failed to load transactions" variant="error" />;
  }
};
