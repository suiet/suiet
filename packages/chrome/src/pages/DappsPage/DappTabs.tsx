import { useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import styles from './index.module.scss';
import tabStyle1 from '../../components/tab/style1.module.scss';
import classnames from 'classnames';
import { Extendable } from '../../types';
import { capitalize } from 'lodash-es';
import SlideWindow from './SlideWindow';
import { DappItem } from '../../api/dapps';
import DappCard, { Skeleton as DappCardSkeleton } from './DappCard';

export type TabsProps = Extendable & {
  featured: DappItem[];
  popular: DappItem[];
  loading?: boolean;
};

const availableTabs = [
  'featured',
  'popular',
  // 'recent',
  // 'new'
];

const DappTabs = (props: TabsProps) => {
  const { loading = false } = props;
  const [activeTab, setActiveTab] = useState<string>('featured');

  function renderTabPanel(dapps: DappItem[], loading = false) {
    return (
      <SlideWindow className={'py-[16px]'}>
        <div className={styles['dapp-cards']}>
          {loading ? (
            <>
              <DappCardSkeleton />
              <DappCardSkeleton className={'ml-[16px]'} />
            </>
          ) : (
            dapps.map((dapp) => (
              <DappCard
                key={dapp.id}
                name={dapp.name}
                icon={dapp.icon}
                desc={dapp.description}
                link={dapp.link}
                bgColor={dapp.background_color}
              />
            ))
          )}
        </div>
      </SlideWindow>
    );
  }

  return (
    <Tabs
      className={props.className}
      focusTabOnClick={false}
      onSelect={(index) => {
        setActiveTab(availableTabs[index]);
      }}
    >
      <TabList className={tabStyle1['tab-list']}>
        {availableTabs.map((tabName, index) => (
          <Tab
            key={tabName}
            tabIndex={String(index)}
            className={classnames(tabStyle1['tab'], {
              [tabStyle1['tab--active']]: activeTab === tabName,
            })}
          >
            {capitalize(tabName)}
          </Tab>
        ))}
      </TabList>

      <TabPanel id={'featured'}>
        {renderTabPanel(props.featured, loading)}
      </TabPanel>
      <TabPanel id={'popular'}>
        {renderTabPanel(props.popular, loading)}
      </TabPanel>
      {/*<TabPanel id={'recent'}>*/}
      {/*  <h2>Any content 2</h2>*/}
      {/*</TabPanel>*/}
      {/*<TabPanel id={'new'}>*/}
      {/*  <h2>Any content 2</h2>*/}
      {/*</TabPanel>*/}
    </Tabs>
  );
};

export default DappTabs;
