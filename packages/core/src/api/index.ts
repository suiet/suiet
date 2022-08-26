import {IWalletApi} from "./wallet";
import {IAccountApi} from "./account";
import {INetworkApi} from "./network";
import {IAuthApi} from "./auth";

export class CoreApi {
  wallet: IWalletApi;
  account: IAccountApi;
  network: INetworkApi;
  auth: IAuthApi;
}