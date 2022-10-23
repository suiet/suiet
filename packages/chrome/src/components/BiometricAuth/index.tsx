import styles from './index.module.scss';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { ReactComponent as FingerPrint } from '../../assets/icons/fingerprint.svg';
import { Extendable } from '../../types';
import classnames from 'classnames';

export type BiometricAuthProps = Extendable & {
  onSuccess?: () => void;
  onFail?: () => void;
};

function BiometricAuth(props: BiometricAuthProps) {
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
    <div className={classnames(styles['biometric-auth'], props.className)}>
      <span
        style={{ cursor: 'pointer' }}
        className={styles['biometric-auth__logo']}
        onClick={async () => {
          const result = await authenticate();
          if (!result) {
            props.onFail?.();
          } else {
            props.onSuccess?.();
          }
        }}
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
