import { Provider } from '../src/provider';
import { Vault } from '../src/vault/Vault';
import * as crypto from '../src/crypto';

const RPC_URL = 'http://127.0.0.1:5001';
// const RPC_URL = 'https://gateway.devnet.sui.io:443';
const ADDRESS = '0x497c0b76ad06f09bd85012fe6a6e22f55f77eea0';
const OBJECT_ID = '0xe76fdca766fb603f3188ab88f0a9b4b799d54c37';
const MNEMONIC =
  'galaxy buyer grab update result comfort example budget word frog teach mask';
test('vault', async () => {
  const mnemonic = crypto.generateMnemonic();
  console.log(mnemonic);
});

test('Transaction tests', async () => {
  const vault = await Vault.fromMnemonic(MNEMONIC);
  const address = vault.getAddress();
  // const address = "0xc04e4c51f809bfa20a13a45e5fd9bae80fb59f75"
  console.log('address', address);
  const provider = new Provider(RPC_URL, RPC_URL);
  await provider.transferCoin('SUI', BigInt(1100000), ADDRESS, vault);
  const coins = await provider.getOwnedCoins(address);
  console.log('target coins', coins);
  const result = new Map();
  for (const object of coins) {
    result.has(object.symbol)
      ? result.set(object.symbol, result.get(object.symbol) + object.balance)
      : result.set(object.symbol, object.balance);
  }
  console.log(
    'target balance',
    Array.from(result.entries()).map((item) => ({
      symbol: item[0] as string,
      balance: item[1] as bigint,
    }))
  );
});
