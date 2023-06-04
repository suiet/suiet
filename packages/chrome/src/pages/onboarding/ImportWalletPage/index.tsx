import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageEntry, usePageEntry } from '../../../hooks/usePageEntry';
import Nav from '../../../components/Nav';
import styles from './index.module.scss';
import { ChooseImportMethodsView } from './views';
import { ImportMethod } from './views/ChooseImportMethodsView';
import ImportMnemonicsView from './views/ImportMnemonicsView';
import Message from '../../../components/message';
import ImportPrivateKeyView from './views/ImportPrivateKeyView';

const ImportWalletPage = () => {
  const navigate = useNavigate();
  const pageEntry = usePageEntry();
  const [importMethod, setImportMethod] = useState<ImportMethod | null>(null);

  const handleFinished = () => {
    Message.success('Wallet Imported!');

    if (pageEntry === PageEntry.SWITCHER) {
      navigate('/home', {
        state: { openSwitcher: true }, // open the wallet switcher
      });
      return;
    }
    navigate('/home');
  };

  function renderView() {
    if (!importMethod) {
      return <ChooseImportMethodsView onSelect={setImportMethod} />;
    }
    switch (importMethod) {
      case 'mnemonics':
        return <ImportMnemonicsView onFinished={handleFinished} />;
      case 'privateKey':
        return <ImportPrivateKeyView onFinished={handleFinished} />;
    }
  }
  return (
    <div className={styles['page']}>
      <Nav
        title={'Import Wallet'}
        navDisabled={importMethod === null && pageEntry === PageEntry.ONBOARD}
        onNavBack={() => {
          if (importMethod !== null) {
            setImportMethod(null);
            return;
          }
          if (pageEntry === PageEntry.SWITCHER) {
            navigate('/home', {
              state: { openSwitcher: true }, // open the wallet switcher
            });
            return;
          }
        }}
      />
      {renderView()}
    </div>
  );
};

export default ImportWalletPage;
