import ReactLoading from 'react-loading';
import styles from './index.module.scss';

export const LoadingSpokes = (props: {
  color?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <ReactLoading type={'spokes'} color={'#3EA2F8'} {...props}></ReactLoading>
  );
};

export const FullPageLoading = () => {
  return <div className={styles['full-page']}></div>;
};
export { default as LoadingSpin } from './LoadingSpin';
