import AppLayout from '../../layouts/AppLayout';
import styles from './index.module.scss';
import Typo from '../../components/Typo';
import DappTabs from './DappTabs';
import { useDappList } from '../../hooks/useDappList';
import { DappItem } from '../../api/dapps';
import DappSection, { Skeleton as DappSectionSkeleton } from './DappSection';
import { isNonEmptyArray } from '../../utils/check';

const mockDapps: DappItem[] = [
  {
    id: 'bluemove',
    name: 'BlueMove',
    description: 'NFT Marketplace on blockchaine Sui',
    icon: 'https://bluemove.net/bluemove_favicon.ico',
    background_color: '#2C64FA',
    link: 'https://bluemove.net/',
  },
  {
    id: 'clutchy',
    name: 'Clutchy',
    description: 'Gaming and NFT Marketplace on Sui',
    icon: 'https://clutchy.io/favicon.ico',
    background_color: '#79B2E8',
    link: 'https://clutchy.io//',
  },
];
const DappsPage = () => {
  const { isLoading, featured, popular, category, categoryKeys } =
    useDappList();
  return (
    <AppLayout className={styles['container']}>
      <header className={styles['header']}>
        <Typo.Title className={styles['title']}>DApps</Typo.Title>
      </header>

      <DappTabs
        className={styles['tabs']}
        featured={featured}
        popular={popular}
        loading={isLoading}
      />

      {isLoading ? (
        <DappSectionSkeleton />
      ) : (
        isNonEmptyArray(categoryKeys) &&
        categoryKeys.map((title) => {
          return (
            <DappSection
              key={title}
              title={title}
              dapps={category.get(title)}
            />
          );
        })
      )}
    </AppLayout>
  );
};

export default DappsPage;
