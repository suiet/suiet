import Button from '../../../components/Button';
import message from '../../../components/message';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { useCallback, useState } from 'react';
import styles from './empty.module.scss';

export type EmptyProps = {
  mintSampleNFT: () => Promise<void>;
  onMintSuccess: () => void;
};

export default function Empty(props: EmptyProps) {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const [sendLoading, setSendLoading] = useState(false);

  const handleMintSampleNFT = useCallback(async () => {
    setSendLoading(true);
    try {
      await props.mintSampleNFT();
      message.success('Mint NFT succeeded');
      props.onMintSuccess();
    } catch (e: any) {
      message.error(`Mint NFT failed: ${e?.message}`);
    } finally {
      setSendLoading(false);
    }
  }, [props.mintSampleNFT, props.onMintSuccess]);

  return (
    <div className="flex flex-col justify-center items-center mx-8">
      <div className={styles['img']} />
      <div className={styles['title']}>No NFT in your wallet</div>
      <div className={styles['description']}>
        You will see your NFT here once you have one.
        <br />
        <a
          href="https://suiet.app/docs/getting-started"
          className="text-sky-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          Get Sui first
        </a>{' '}
        to get start your journey
        {network?.enableMintExampleNFT && (
          <Button
            onClick={handleMintSampleNFT}
            loading={sendLoading}
            style={{ marginTop: '18px' }}
          >
            Mint NFT
          </Button>
        )}
      </div>
    </div>
  );
}
