import SetPassword from "./SetPassword";
import SavePhrase from "./SavePhrase";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
  resetAppContext,
  updateAccountId,
  updateInitialized,
  updateToken,
  updateWalletId
} from "../../../store/app-context";
import {isNonEmptyArray} from "../../../utils/check";
import toast from "../../../components/toast";
import {coreApi} from "@suiet/core";
import {AppDispatch} from "../../../store";

export interface CreateWalletStepProps {
  onNext: () => void;
}

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const navigation = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  async function handleSetPassword(password: string) {
    await coreApi.updatePassword(null, password);
    const token = await coreApi.loadTokenWithPassword(password);

    const wallet = await coreApi.createWallet({
      token: token,
    })

    const rawPhrases = await coreApi.revealMnemonic(wallet.id, token);
    setPhrases(rawPhrases.split(' '));

    const accounts = await coreApi.getAccounts(wallet.id);
    if (!isNonEmptyArray(accounts)) {
      toast.success('Cannot find any account')
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];

    await dispatch(updateToken(token));
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));
    await dispatch(updateInitialized(true));

    setStep((s) => s + 1);
  }

  async function handleSavePhrase() {
    setConfirmCreate(true);
    navigation('/home');
  }

  // useEffect(() => {
  //   return () => {
  //     // if not confirmed when leaving,
  //     // consider user miss to remember mnemonic, abandon the pre-create wallet data
  //     if (!confirmCreate) {
  //       console.log('not confirmed!, reset all data')
  //       // clear db data
  //       coreApi.resetAppData(tmpContext.token).then(() => {
  //         dispatch(resetAppContext()); // clear memory data
  //       });
  //     }
  //   }
  // }, [confirmCreate])

  switch(step) {
    case 2: return <SavePhrase phrases={phrases} onNext={handleSavePhrase} />;
    default:
      return <SetPassword onNext={handleSetPassword} />;
  }
}

export default CreateNewWallet;