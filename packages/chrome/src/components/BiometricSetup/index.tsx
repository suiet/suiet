import * as React from 'react';
import styles from './index.module.scss';
import { ReactComponent as FingerPrint } from '../../assets/icons/fingerprint.svg';
import { ReactComponent as CloseCircled } from '../../assets/icons/close-circled.svg';
import Typo from '../Typo';

import { useBiometricAuth } from '../../hooks/useBiometricAuth';

function BiometricSetup() {
  const { isSupported, isDismissed, isSetuped, dismiss, setup } =
    useBiometricAuth();

  if (!isSupported) {
    return null;
  }

  if (isDismissed) {
    // TODO(hzy): persist dismiss state
    return null;
  }

  if (isSetuped === undefined) {
    // TODO(hzy): show loading
    return null;
  }

  if (isSetuped) {
    return null;
  }

  return (
    <div className={styles['setup-biometric']} onClick={setup}>
      <span className={styles['setup-biometric__logo']}>
        <FingerPrint width="24" height="24" />
      </span>

      <div className={styles['setup-biometric__content']}>
        <Typo.Normal className={styles['setup-biometric__title']}>
          Setup Touch ID
        </Typo.Normal>
        <Typo.Small className={styles['setup-biometric__desc']}>
          Secure your wallet with Touch ID
        </Typo.Small>
      </div>

      <span
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
      >
        <CloseCircled />
      </span>
    </div>
  );
}

export default BiometricSetup;
