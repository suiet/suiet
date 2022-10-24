export type Network = {
  id: string;
  name: string;
  queryRpcUrl: string;
  txRpcUrl: string;
  rpcVersion: string;
  mintExampleNftGasBudget?: number;
  transferObjectGasBudget?: number;
  payCoinGasBudget?: number;
};

export interface INetworkApi {
  getNetworks: (enabledOnly: boolean) => Promise<Network[]>;
  getNetwork: (networkId: string) => Promise<Network | undefined>;
  // addCustomNetwork: (network: Network) => Promise<void>;
}

const DEFAULT_NETWORKS = new Map([
  [
    'devnet',
    {
      id: 'devnet',
      name: 'devnet',
      queryRpcUrl: 'https://fullnode.devnet.sui.io/',
      txRpcUrl: 'https://fullnode.devnet.sui.io:443',
      rpcVersion: '0.12.2',
    },
  ],
  [
    'testnet',
    {
      id: 'testnet',
      name: 'testnet',
      queryRpcUrl: 'https://fullnode.testnet.sui.io/',
      txRpcUrl: 'https://fullnode.testnet.sui.io:443',
      rpcVersion: '0.12.2',
    },
  ],
  [
    'local',
    {
      id: 'local',
      name: 'local',
      queryRpcUrl: 'http://localhost:5001',
      txRpcUrl: 'http://localhost:5001',
      rpcVersion: '0.12.2',
    },
  ],
]);

export class NetworkApi implements INetworkApi {
  async getNetworks(enabledOnly: boolean): Promise<Network[]> {
    return Array.from(DEFAULT_NETWORKS.values());
  }

  async getNetwork(networkId: string): Promise<Network | undefined> {
    return DEFAULT_NETWORKS.get(networkId);
  }
}
