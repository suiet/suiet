import styles from "./index.module.scss";
import IconDownDouble from '../../../assets/icons/down-double.svg';
import IconQrCode from '../../../assets/icons/qrcode.svg';
import IconTrendUp from '../../../assets/icons/trendup.svg';
import {Link} from "react-router-dom";
import Modal from "../../../components/Modal";
import WaterDropIcon from "../../../components/WaterDropIcon";
import CopyIcon from "../../../components/CopyIcon";
import Typo from "../../../components/Typo";
import TestQrCode from '../../../assets/test-qrcode.png';
import QRCodeSVG from "qrcode.react";
import classnames from "classnames";
import {useEffect, useState} from "react";
import toast from "../../../components/toast";
import {ReactComponent as IconSuccess} from "../../../assets/icons/toast-success.svg";
import copy from "copy-to-clipboard";
import {useAccount} from "../../../hooks/useAccount";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {addressEllipsis} from "../../../utils/format";

export type ReceiveButtonProps = {
  address: string;
}

const ReceiveButton = (props: ReceiveButtonProps) => {
  return (
    <Modal
      title={(
        <div className={'flex items-center'}>
          <span>Receive</span>
          <WaterDropIcon size={'small'} className={'ml-[8px]'} />
        </div>
      )}
      trigger={(
        <div className={styles['receive']}>
          {/* <img src={IconQrCode} className={styles['icon']} /> */}
          <span>Receive</span>
        </div>
      )}
    >
      <div className={'flex flex-col items-center mt-[22px]'}>
        <div className={'flex flex-col items-center'}>
          <QRCodeSVG value={props.address} className={styles['qr-code']} />
          <Typo.Normal className={classnames('mt-[2px]', styles['text-scan'])}>
            scan to receive
          </Typo.Normal>
        </div>
        <div className={'flex items-center mt-[21px]'}>
          <Typo.Small>0x2152f01152f01f6152f01f6f6</Typo.Small>
          <CopyIcon className={'ml-[5px]'} onClick={() => {
            copy(props.address);
            toast.success('Copied Address')
          }}></CopyIcon>
        </div>
      </div>
    </Modal>
  )
}

function MainPage() {
  const context = useSelector((state: RootState) => state.appContext)
  const {account} = useAccount(context.wallId, context.accountId);

  return (
    <div className={styles['main-content']}>
      <div className={styles['balance']}>1000 SUI</div>
      <div className={styles['address']}>
        <span>{addressEllipsis(account.address)}</span>
        <CopyIcon className={'ml-[5px]'}
          copyStr={account.address}
          onCopied={() => toast.success('Copied Address')}
        />
      </div>
      <div className={styles['operations']}>
        <div className={styles['airdrop']} onClick={() => {}}>
          {/* <img src={IconDownDouble} className={styles['icon']} /> */}
          Airdrop
        </div>
        <ReceiveButton address={account.address} />
        <Link to={'/send'}>
          <div className={styles['send']}>
            {/* <img src={IconTrendUp} className={styles['icon']} /> */}
            Send
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
