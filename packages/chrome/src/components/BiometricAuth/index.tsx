import styles from './index.module.scss';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { ReactComponent as FingerPrint } from '../../assets/icons/fingerprint.svg';

function BiometricAuth() {
  const { isSupported, isSetuped, authenticate } = useBiometricAuth();

  if (!isSupported) {
    return null;
  }

  if (typeof isSetuped === 'undefined') {
    return null;
  }

  if (!isSetuped) {
    return null;
  }

  return (
    <div
      style={{
        margin: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '16px',
        alignItems: 'center',
      }}
    >
      <span
        style={{ cursor: 'pointer' }}
        className={styles['biometric-auth__logo']}
        onClick={authenticate}
      >
        <FingerPrint width="24" height="24" />
      </span>

      {/* <span style={{ cursor: 'pointer' }} onClick={reset}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#D3F8DF" />
          <path
            d="M15.9167 8L8 15.9167M8 8L15.9167 15.9167"
            stroke="#099250"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span> */}
    </div>
  );
}

export default BiometricAuth;
