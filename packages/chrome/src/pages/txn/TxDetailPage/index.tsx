import { Icon, IconContainer } from '../../../components/icons';
import Typo from '../../../components/Typo';
import { isNonEmptyArray, safe } from '@suiet/core';
import { TxSummaryItem, TemplateIcon } from '../../../components/tx-history';
import Nav from '../../../components/Nav';
import { useNavigate, useParams } from 'react-router-dom';
import { Extendable } from '../../../types';
import classNames from 'classnames';
import { ReactComponent as IconExternal } from '../../../assets/icons/external.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import useTxnDetail, {
  TxnDetailAssetChangeDto,
  TxnDetailMetadataDto,
  TxnDetailSubAssetChangesDto,
} from './hooks/useTxnDetail';
import { useAccount } from '../../../hooks/useAccount';
import { useEffect } from 'react';
import { DisplayItemDto } from '../types';
import TemplateText from '../../../components/tx-history/TemplateText';

export type TxDetailPageProps = {};

const TxnMetric = (
  props: Extendable & {
    label: string;
    value: string;
    icon?: string;
    valueType?: 'text';
  }
) => {
  const { label, value, icon, valueType = 'text' } = props;
  return (
    <div className={'flex items-center px-[24px] py-[8px]'}>
      <Icon
        icon={icon}
        stroke={'#7D89B0'}
        className={'grow-0 w-[16px] h-[16px] ml-[10px]'}
      />
      <Typo.Small
        className={
          'grow text-gray-400 text-small ml-[26px] max-w-[110px] ellipsis'
        }
      >
        {label}
      </Typo.Small>
      <TemplateText
        type={valueType}
        value={value}
        className={
          'grow-0 text-gray-800 text-small ml-auto ellipsis max-w-[160px]'
        }
      />
    </div>
  );
};

export type TxnSubAssetChangeItemProps = Extendable & {
  icon: string | null;
  text: DisplayItemDto | null;
  assetChange: DisplayItemDto | null;
};

function TxnSubAssetChangeItem(props: TxnSubAssetChangeItemProps) {
  const { icon, text, assetChange } = props;
  return (
    <div className={'flex items-center px-[24px] py-[8px]'}>
      <IconContainer
        shape={'circle'}
        color={'transparent'}
        className={'w-[16px] h-[16px] ml-[10px]'}
      >
        <Icon icon={safe(icon, 'Wallet')} stroke={'#7D89B0'} />
      </IconContainer>
      <TemplateText
        className={classNames(
          'ml-[26px]',
          safe(assetChange?.color, 'text-gray-500')
        )}
        value={safe(text?.text, '')}
        type={safe(text?.type, 'text')}
      />
      <Typo.Small
        className={classNames(
          'text-small ml-auto ellipsis max-w-[130px]',
          safe(assetChange?.color, 'text-gray-400')
        )}
      >
        {safe(assetChange?.text, '')}
      </Typo.Small>
    </div>
  );
}

const Divider = (props: Extendable) => {
  return (
    <div
      className={classNames('w-full h-[1px] bg-gray-100', props.className)}
    ></div>
  );
};

const ExternalLink = (
  props: Extendable & {
    href: string;
  }
) => {
  return (
    <a
      target="_blank"
      href={props.href}
      className={props.className}
      rel="noreferrer"
    >
      <div
        className={classNames(
          'text-zinc-500',
          'hover:text-zinc-600',
          'px-4',
          'py-2',
          'rounded-xl',
          'font-medium',
          'w-fit',
          'hover:bg-zinc-100',
          'active:bg-zinc-200',
          'transition-all'
        )}
      >
        {props.children}
        <IconExternal
          className={classNames(
            'ml-2 inline w-[12px] h-[12px] stroke-gray-400',
            'text-zinc-500'
          )}
        ></IconExternal>
      </div>
    </a>
  );
};

const TxDetailPage = (props: TxDetailPageProps) => {
  const navigate = useNavigate();
  const { networkId } = useSelector((state: RootState) => state.appContext);
  const params = useParams();
  const digest = safe(params?.digest, '');
  const { accountId } = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(accountId);
  const { data: txnDetailRes } = useTxnDetail(digest, address);
  const txnDetail = txnDetailRes?.display?.detail;
  const assetChanges = safe<TxnDetailAssetChangeDto[]>(
    txnDetail?.assetChanges,
    []
  );
  const metadataList = safe<TxnDetailMetadataDto[]>(txnDetail?.metadata, []);

  useEffect(() => {
    if (!digest) {
      throw new Error('digest is required');
    }
  }, []);

  console.log('digest', digest);
  console.log('txnDetail', txnDetail);
  console.log('assetChanges', assetChanges);

  return (
    <div className={'w-full h-full overflow-y-auto no-scrollbar bg-white'}>
      <Nav
        title={'Txn Detail'}
        className={'sticky top-0 z-10 bg-white'}
        onNavBack={() => navigate('/transaction/flow')}
      />
      <header className={'flex flex-col items-center my-[16px]'}>
        <TemplateIcon
          icon={'TxnSuccess'}
          containerProps={{
            className: 'w-[52px] h-[52px]',
            shape: 'circle',
          }}
          iconProps={{
            width: '24px',
            height: '24px',
            strokeWidth: '1.5',
            elStyle: { fontWeight: 'bold' },
          }}
        />
        <Typo.Title
          className={'text-[28px] font-bold mt-[16px] max-w-[300px] ellipsis'}
        >
          {safe(txnDetail?.title, 'Unknown Type')}
        </Typo.Title>
        <Typo.Small className={'text-[14px] text-gray-500 max-w-[300px]'}>
          {safe(txnDetail?.description, '')}
        </Typo.Small>
      </header>
      <main>
        {isNonEmptyArray(assetChanges) && (
          <>
            <Divider className={'my-[16px]'} />
            {assetChanges.map((item, index) => {
              const description = safe<DisplayItemDto | null>(
                item?.description,
                null
              );
              const assetChange = safe<DisplayItemDto | null>(
                item?.assetChange,
                null
              );
              const assetChangeDescription = safe<DisplayItemDto | null>(
                item?.assetChangeDescription,
                null
              );
              const subAssetChanges = safe<TxnDetailSubAssetChangesDto[]>(
                item?.subAssetChanges,
                []
              );

              return (
                <div key={item.title + index}>
                  <TxSummaryItem
                    className={'!px-[24px]'}
                    title={safe(item?.title, '')}
                    desc={safe(description?.text, '')}
                    descType={safe(description?.type, 'text')}
                    icon={safe(item?.icon, 'Txn')}
                    changeTitle={safe(assetChange?.text, '')}
                    changeTitleColor={safe(assetChange?.color, '')}
                    changeDesc={safe(assetChangeDescription?.text, '')}
                    changeDescColor={safe(assetChangeDescription?.color, '')}
                    changeDescType={safe(assetChangeDescription?.type, 'text')}
                  />
                  {subAssetChanges.map((subAssetChange, index) => {
                    return (
                      <TxnSubAssetChangeItem
                        key={safe(subAssetChange?.text?.text, '') + index}
                        icon={subAssetChange?.icon}
                        text={subAssetChange?.text}
                        assetChange={subAssetChange?.assetChange}
                      />
                    );
                  })}
                </div>
              );
            })}
          </>
        )}
      </main>
      <footer className={'pb-[32px]'}>
        {isNonEmptyArray(metadataList) && (
          <>
            <Divider className={'my-[16px] w-[314px] mx-auto'} />
            {metadataList.map((metadata, index) => {
              return (
                <TxnMetric
                  key={metadata?.key + index}
                  icon={safe(metadata?.icon, '')}
                  label={safe(metadata?.key, '')}
                  value={safe(metadata?.value?.text, '')}
                  valueType={safe(metadata?.value?.type, 'text')}
                />
              );
            })}
          </>
        )}
        <Divider className={'my-[16px] w-[314px] mx-auto'} />
        <div className={'flex justify-center items-center'}>
          <ExternalLink
            href={
              `https://explorer.sui.io/transactions/` +
              encodeURIComponent(digest) +
              `?network=${networkId}`
            }
          >
            Sui Explorer
          </ExternalLink>
          <ExternalLink
            href={
              `https://${
                networkId === 'testnet' ? 'testnet.' : ''
              }suivision.xyz/txblock/` + encodeURIComponent(digest)
            }
          >
            SuiVision
          </ExternalLink>
        </div>
      </footer>
    </div>
  );
};

export default TxDetailPage;
