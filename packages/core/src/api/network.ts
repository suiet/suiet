export type Network = {
  id: string;
  name: string;
  rpcURL: string;
};

export interface INetworkApi {
  getNetworks: (enabledOnly: boolean) => Promise<Network[]>;
  getNetwork: (networkId: string) => Promise<Network | undefined>;
  // addCustomNetwork: (network: Network) => Promise<void>;
}

const DEFAULT_NETWORKS = new Map([
  ['devnet', {
    id: 'devnet',
    name: 'devnet',
    rpcURL: 'https://gateway.devnet.sui.io:443',
  }],
  ['local', {
    id: 'local',
    name: 'local',
    rpcURL: '',
  }],
]);

export class NetworkApi implements INetworkApi {
  async getNetworks(enabledOnly: boolean): Promise<Network[]> {
    return Array.from(DEFAULT_NETWORKS.values())
  }
  async getNetwork(networkId: string): Promise<Network | undefined> {
    return DEFAULT_NETWORKS.get(networkId)
  }
}
