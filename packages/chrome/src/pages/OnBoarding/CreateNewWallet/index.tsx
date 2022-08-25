import SetPassword from "./SetPassword";
import SavePhrase from "./SavePhrase";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {decryptMnemonic, encryptPassword, MockWallet, storage} from "../../../utils/mock";
import setPassword from "./SetPassword";
import {storePassword, storeWalletCredentials} from "../../../utils/auth";
import {useDispatch} from "react-redux";
import {updateInitialized, updateToken} from "../../../store/app-context";

export interface CreateWalletStepProps {
  onNext: () => void;
}

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const [phrases, setPhrases] = useState<string[]>([]);
  const navigation = useNavigate();
  const dispatch = useDispatch();

  async function handleSetPassword(password: string) {
    const wallet = await MockWallet.createAndSave(password, storage as any);
    const token = encryptPassword(password);
    await dispatch(updateToken(token));
    const rawPhrases = decryptMnemonic(password, wallet.wallet.encryptedMnemonic);
    setPhrases(rawPhrases.split(' '));

    // await storeWalletCredentials(wallet.wallet.id, wallet.encryptedMnemonic);
    setStep((s) => s + 1);
  }

  async function handleSavePhrase() {
    await dispatch(updateInitialized(true));
    navigation('/home');
  }

  switch(step) {
    case 2: return <SavePhrase phrases={phrases} onNext={handleSavePhrase} />;
    default:
      return <SetPassword onNext={handleSetPassword} />;
  }
}

export default CreateNewWallet;