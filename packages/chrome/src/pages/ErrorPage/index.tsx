import styles from './index.module.scss';
import classnames from 'classnames';
import Button from '../../components/Button';
import BrandLayout from '../../layouts/BrandLayout';

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
    <BrandLayout
      grayTitle={'Error'}
      blackTitle={'Suiet'}
      desc={'Oops, something went wrong.'}
    >
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
    </BrandLayout>
  );
};

export default ErrorPage;
