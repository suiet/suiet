import classnames from 'classnames';
import './common.scss';

export default function () {
  return (
    <div className="network-setting-container">
      <div className="setting-title">Network</div>
      <div className="setting-desc">Switch between different network</div>
      <div className={classnames('setting-btn', 'wallet-save')}>Save</div>
      <div className={classnames('setting-btn', 'wallet-cancel')}>Cancel</div>
    </div>
  );
}
