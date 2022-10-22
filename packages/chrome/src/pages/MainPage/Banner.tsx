import { useEffect, useMemo } from 'react';
import { isNonEmptyArray } from '../../utils/check';
import { useChromeStorage } from '../../hooks/useChromeStorage';
import { StorageKeys } from '../../store/enum';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import classnames from 'classnames';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import styles from './index.module.scss';

enum BannerPriority {
  DEVNET_WARNING = 0,
  SUI_ON_MAINTENANCE = 999,
}

interface BannerQueueItem {
  priority: BannerPriority;
  key: string;
  containerClassName: string;
  element: JSX.Element;
}

function useDevnetWarningBanner(
  networkId: string
): BannerQueueItem | undefined {
  const { data: showDevnetWarning, setItem: setShowDevnetWarning } =
    useChromeStorage<boolean>(StorageKeys.TIPS_DEVNET_WARNING, true);
  useEffect(() => {
    if (!networkId) return;
    if (networkId !== 'devnet' && showDevnetWarning === true) {
      setShowDevnetWarning(false);
    }
  }, [networkId, showDevnetWarning]);

  if (!showDevnetWarning) return undefined;
  return {
    priority: BannerPriority.DEVNET_WARNING,
    key: 'DEVNET_WARNING',
    containerClassName: 'bg-orange-400',
    element: (
      <>
        On devnet, your assets will be wiped periodically
        <br />
        <div className="flex m-auto items-center align-middle justify-center gap-2 mt-1">
          <button
            className="px-3 py-1 rounded-3xl bg-white text-orange-400"
            onClick={() => {
              setShowDevnetWarning(false);
            }}
          >
            Got it
          </button>
          <a
            href="https://suiet.app/docs/why-my-tokens-wiped-out-on-devnet"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Why?
          </a>
        </div>
      </>
    ),
  };
}

function useSuiUnderMaintenanceBanner(
  networkId: string
): BannerQueueItem | undefined {
  const featureFlags = useFeatureFlags();
  const flag = featureFlags?.networks
    ? featureFlags.networks[networkId]?.on_maintenance
    : false;

  if (!flag) return undefined;
  return {
    priority: BannerPriority.SUI_ON_MAINTENANCE,
    key: 'SUI_ON_MAINTENANCE',
    containerClassName: 'bg-orange-400',
    element: (
      <div className={styles['banner-content']}>
        🚧 Sui network is under maintenance 🚧
        <br />
        Functions might break.️ Please be patient ❤️
      </div>
    ),
  };
}

export const Banner = () => {
  const { networkId } = useSelector((state: RootState) => state.appContext);

  const devnetWarningBanner = useDevnetWarningBanner(networkId);
  const suiUnderMaintenanceBanner = useSuiUnderMaintenanceBanner(networkId);

  const bannerQueue = useMemo(() => {
    return [devnetWarningBanner, suiUnderMaintenanceBanner]
      .filter((item) => item !== undefined)
      .sort(
        // descending order
        (a, b) =>
          (b as BannerQueueItem).priority - (a as BannerQueueItem).priority
      );
  }, [devnetWarningBanner, suiUnderMaintenanceBanner]);

  const topBanner = useMemo(() => {
    if (!isNonEmptyArray(bannerQueue)) return undefined;
    return bannerQueue[0];
  }, [bannerQueue]);

  if (!topBanner) return null;
  return (
    <section
      className={classnames(styles['banner'], topBanner.containerClassName)}
    >
      {topBanner.element}
    </section>
  );
};

export default Banner;
