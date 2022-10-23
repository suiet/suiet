import styles from './index.module.scss';
import Button from '../Button';
import { ReactComponent as FingerPrint } from '../../assets/icons/fingerprint.svg';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';

const BiometricSetting = () => {
  const { isSupported, isSetuped, setup, reset } = useBiometricAuth();

  if (!isSupported) {
    return null;
  }

  if (typeof isSetuped === 'undefined') {
    // placeholder to avoid layout shift
    return (
      <div style={{ width: '100%', height: '48px', marginBottom: '16px' }} />
    );
  }

  return !isSetuped ? (
    <button
      className={styles['biometric-button']}
      style={{ marginBottom: '16px' }}
      onClick={setup}
    >
      <FingerPrint />
      Setup Touch ID
    </button>
  ) : (
    <Button state={'danger'} style={{ marginBottom: '16px' }} onClick={reset}>
      <FingerPrint />
      Disable Touch ID
    </Button>
  );
};

export default BiometricSetting;
