export type Network = {
  id: string;
  name: string;
  shortName: string;
  shortCode?: string;
  rpcURL: string;
  isTestnet: boolean;
};

export interface INetworkApi {
  getNetworks: (enabledOnly: boolean) => Promise<Array<Network>>;
  getNetwork: (networkId: string) => Promise<Network>;
  addCustomNetwork: (network: Network) => Promise<void>;
}
