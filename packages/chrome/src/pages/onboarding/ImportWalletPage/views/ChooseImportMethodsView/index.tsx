import SettingOneLayout from '../../../../../layouts/SettingOneLayout';
import { ReactComponent as ImportRecoveryPhrase } from '../../../../../assets/pages/ImportWallet/ImportRecoveryPhrase.svg';
import { ReactComponent as ImportPrivateKey } from '../../../../../assets/pages/ImportWallet/ImportPrivateKey.svg';
import { Extendable } from '../../../../../types';

export type ImportMethod = 'mnemonics' | 'privateKey' | 'onekey' | 'keystone';

export type ChooseImportMethodsProps = Extendable & {
  onSelect: (method: ImportMethod) => void;
};
export default function ChooseImportMethodsView(
  props: ChooseImportMethodsProps
) {
  return (
    <SettingOneLayout
      titles={['Import', 'Wallet']}
      desc={'Choose import method below.'}
    >
      <div className="flex flex-col mt-8 gap-4">
        <ImageContainer
          onClick={() => {
            props.onSelect('mnemonics');
          }}
        >
          <ImportRecoveryPhrase />
        </ImageContainer>
        <ImageContainer
          onClick={() => {
            props.onSelect('privateKey');
          }}
        >
          <ImportPrivateKey />
        </ImageContainer>
      </div>
    </SettingOneLayout>
  );
}

function ImageContainer(
  props: Extendable & {
    onClick?: () => void;
  }
) {
  return (
    <div
      onClick={props.onClick}
      className="rounded-2xl cursor-pointer hover:bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-2xl  hover:shadow-zinc-100 transition"
    >
      {props.children}
    </div>
  );
}
