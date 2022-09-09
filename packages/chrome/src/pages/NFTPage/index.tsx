import NftList from '../NFTPage/NftList';
import classnames from 'classnames';
function MainPage() {
  return (
    <div className={classnames('pt-4')}>
      {/* <div className="ml-2 text-3xl my-4 font-medium">NFT</div> */}
      <NftList />
    </div>
  );
}

export default MainPage;
