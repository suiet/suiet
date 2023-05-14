import { Extendable } from '../../types';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import GuideLayout from '../../layouts/GuideLayout';
import { compareVersions } from 'compare-versions';
import { ReactComponent as IconArrowUpRight } from '../../assets/icons/arrow-up-right.svg';
import { ReactComponent as IconLink } from '../../assets/icons/link.svg';
import { version } from '../../../package.json';
import { useEffect } from 'react';

export type GuideContainerProps = Extendable;

export default function VersionGuard(props: GuideContainerProps) {
  const featureFlags = useFeatureFlags();
  const chromeVersion = getChromeVersion();

  useEffect(() => {
    if (
      featureFlags &&
      compareVersions(version, featureFlags.minimal_versions.extension) < 0
    ) {
      chrome.runtime.requestUpdateCheck((status: string, details: any) => {});
    }
  });
  if (
    featureFlags &&
    chromeVersion &&
    compareVersions(chromeVersion, featureFlags.minimal_versions.chrome) < 0
  ) {
    return (
      <GuideLayout blackTitle="Browser Update Needed">
        <div className="text-coolGray-400 mx-[36px] mt-2 font-medium">
          <p className="mb-1">
            It looks like your Chrome browser v{chromeVersion} is not
            up-to-date. To maintain security and compatibility, please follow
            these steps to upgrade:
          </p>

          <li>
            Copy and visit:{' '}
            <p className="inline text-gray-600">chrome://settings/help</p>
          </li>
          <li>Wait for Chrome detect and install latest version</li>
          <li>Then click &quot;Relaunch&quot; button to reload browser</li>
          <li>Open Suiet Wallet again in your Chrome Extensions</li>
        </div>
        <br />
        <a
          href="https://suiet.app/docs/how-to-upgrade-browser"
          target="_blank"
          rel="noreferrer"
          className="w-fill text-coolGray-500 font-bold hover:text-coolGray-600 mx-[36px] h-[56px] bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-2xl transition-all flex items-center px-[24px]"
        >
          <IconArrowUpRight width={24} height={24} className="mr-[16px]" />
          Follow Guide
        </a>

        <div className="flex w-full fixed bottom-[0]">
          <a
            className="flex mx-[36px] my-[24px] text-coolGray-400 items-center"
            href="https://suiet.app/docs/how-to-upgrade-browser"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-1">
              Docs
              <IconLink stroke="#7D89B0" />
            </div>
          </a>
        </div>
      </GuideLayout>
    );
  }

  if (
    featureFlags &&
    compareVersions(version, featureFlags.minimal_versions.extension) < 0
  ) {
    return (
      <GuideLayout blackTitle="Extension Update Needed">
        <div className="text-coolGray-400 mx-[36px] mt-2 font-medium">
          <p className="mb-1">
            It looks like you are using an outdated version of Suiet Wallet
            Extension. To maintain security and compatibility, please follow
            these steps to upgrade:
          </p>
          <li>
            Copy and visit:{' '}
            <p className="inline text-gray-600">chrome://extensions/</p>
          </li>
          <li>Open &quot;Developer mode&quot;</li>
          <li>
            Click the &quot;Update&quot; button waiting pop up says
            &quot;Extensions updated&quot;
          </li>
        </div>
        <br />
        <a
          href="https://suiet.app/docs/how-to-upgrade-extension"
          target="_blank"
          rel="noreferrer"
          className="w-fill text-coolGray-500 font-bold hover:text-coolGray-600 mx-[36px] h-[56px] bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-2xl transition-all flex items-center px-[24px]"
        >
          <IconArrowUpRight width={24} height={24} className="mr-[16px]" />
          Follow Guide
        </a>

        <div className="flex w-full fixed bottom-[0]">
          <a
            className="flex mx-[36px] my-[24px] text-coolGray-400 items-center"
            href="https://suiet.app/docs/how-to-upgrade-extension"
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex items-center gap-1">
              Docs
              <IconLink stroke="#7D89B0" />
            </div>
          </a>
        </div>
      </GuideLayout>
    );
  }

  return <>{props.children}</>;
}

function getChromeVersion() {
  const userAgent = navigator.userAgent;
  const chromeRegex = /(?:Chrome|Chromium)\/(\d+\.\d+\.\d+\.\d+)/i;
  const match = userAgent.match(chromeRegex);

  if (match !== null) {
    const versionString = match[1];
    return versionString;
  } else {
    return null;
  }
}
