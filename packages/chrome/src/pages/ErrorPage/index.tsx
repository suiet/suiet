import styles from './index.module.scss';
import Typo from '../../components/Typo';
import classnames from 'classnames';
import { ReactComponent as LogoGrey } from '../../assets/icons/logo-grey.svg';
import Icon from '../../components/Icon';
import Button from '../../components/Button';

export type ErrorPageProps = {
  error: Error | string;
};

const ErrorPage = (props: ErrorPageProps) => {
  function getErrorMsg() {
    const errMsg =
      props.error instanceof Error ? props.error.message : props.error;
    return errMsg || 'Unknown Error';
  }

  return (
    <div className={classnames(styles['main-page'])}>
      <Icon elClassName={styles['logo']} icon={<LogoGrey />} />
      <Typo.Title className={classnames(styles['suiet-title'], 'mt-[64px]')}>
        Error
      </Typo.Title>
      <Typo.Title
        className={classnames(
          styles['suiet-title'],
          styles['suiet-title--black']
        )}
      >
        Suiet
      </Typo.Title>
      <Typo.Normal className={classnames(styles['suiet-desc'])}>
        Oops, something went wrong.
      </Typo.Normal>
      <div className={'w-full mt-[8px]'}>
        <p className={classnames(styles['error-msg'], 'mt-[6px]')}>
          <span>Error Message:</span>
          <br />
          {getErrorMsg()}
        </p>
      </div>
      <div className={'w-full flex justify-between items-center mt-[16px]'}>
        <Button
          onClick={() => {
            console.error('report error:', props.error);
          }}
        >
          Report
        </Button>
        <Button
          className={'ml-[12px]'}
          state={'primary'}
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
