import NftList from '../NFTPage/NftList';

import classnames from 'classnames';
function MainPage() {
  return (
    <div className={classnames('pt-4')}>
      <NftList />
    </div>
  );
}

export default MainPage;
