import { Base64DataBuffer, Coin, Provider, TxnDataSerializer } from "@mysten/sui.js"
import { Account, Wallet } from "../storage/types"

type UnsignedTx = {
	from: string,
	to: string,
	amount: number,
	data: Base64DataBuffer,
	token?: string,
}
