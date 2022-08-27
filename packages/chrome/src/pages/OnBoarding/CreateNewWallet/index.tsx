import SetPassword from "./SetPassword";
import SavePhrase from "./SavePhrase";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateAccountId, updateInitialized, updateToken, updateWalletId} from "../../../store/app-context";
import {isNonEmptyArray} from "../../../utils/check";
import toast from "../../../components/toast";
import {coreApi} from "@suiet/core";

export interface CreateWalletStepProps {
  onNext: () => void;
}

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const [phrases, setPhrases] = useState<string[]>([]);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  async function handleSetPassword(password: string) {
    await coreApi.updatePassword(null, password);
    const token = await coreApi.loadTokenWithPassword(password);
    console.log('token', token)

    const wallet = await coreApi.createWallet({
      token: token,
    })
    console.log('wallet', wallet)

    const rawPhrases = await coreApi.revealMnemonic(wallet.id, token);
    console.log('rawPhrases', rawPhrases)
    setPhrases(rawPhrases.split(' '));

    const accounts = await coreApi.getAccounts(wallet.id);
    console.log('accounts', accounts)
    if (!isNonEmptyArray(accounts)) {
      toast.success('Cannot find any account')
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];

    await dispatch(updateToken(token));
    await dispatch(updateAccountId(defaultAccount.address))
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateInitialized(true));

    setStep((s) => s + 1);
  }

  async function handleSavePhrase() {
    navigation('/home');
  }

  switch(step) {
    case 2: return <SavePhrase phrases={phrases} onNext={handleSavePhrase} />;
    default:
      return <SetPassword onNext={handleSetPassword} />;
  }
}

export default CreateNewWallet;