import SetPassword from "./SetPassword";
import SavePhrase from "./SavePhrase";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export interface CreateWalletStepProps {
  onNext: () => void;
}

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const navigation = useNavigate();

  function handleSetPassword() {
    setStep((s) => s + 1);
  }

  function handleSavePhrase() {
    navigation('/home');
  }

  switch(step) {
    case 2: return <SavePhrase onNext={handleSavePhrase} />;
    default:
      return <SetPassword onNext={handleSetPassword} />;
  }
}

export default CreateNewWallet;