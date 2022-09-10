import styles from './empty.module.scss';

export default function Empty() {
  return (
    <div className="flex flex-col justify-center items-center mx-8">
      <div className={styles['img']} />
      <div className={styles['title']}>No NFT in your wallet</div>
      <div className={styles['description']}>
        You will see your NFT here once you have one.{' '}
        <a
          href="https://suiet.app/docs/getting-started"
          className="text-sky-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          Check this out
        </a>{' '}
        to get start your journey
      </div>
    </div>
  );
}
