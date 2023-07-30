import Button from '../../../components/Button';
import message from '../../../components/message';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { useCallback, useState } from 'react';
import styles from './empty.module.scss';
import { useQuery } from '@apollo/client';
import { GET_NFT_LIST } from '../../../hooks/useNftList';
export type EmptyProps = {
  mintSampleNFT: () => Promise<void>;
  onMintSuccess: () => void;
};

// - Company Name
// - Company Description
// - Web2 DNS/Trademark registrations owned w/ date of registration
// - Link to websites
// - Team + Contact Info

export default function Empty(props: EmptyProps) {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const [sendLoading, setSendLoading] = useState(false);
  const { client } = useQuery(GET_NFT_LIST, {
    skip: true,
  });
  const handleMintSampleNFT = useCallback(async () => {
    setSendLoading(true);
    try {
      await props.mintSampleNFT();
      props.onMintSuccess();
    } catch (e: any) {
      message.error(`Mint NFT failed: ${e?.message}`);
    } finally {
      client.resetStore();
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
          href="https://docs.suiet.app/wallet/get-started/get-started"
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
