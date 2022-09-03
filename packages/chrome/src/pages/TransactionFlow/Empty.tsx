import Rreact from 'react';
import styles from './empty.module.scss';

export default function Empty() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className={styles['img']} />
      <div className={styles['title']}>No History</div>
      <div className={styles['description']}>
        You will see your activity here once you use the wallet. Check this out
        to get start your journey
      </div>
    </div>
  );
}
