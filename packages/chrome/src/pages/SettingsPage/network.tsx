import classnames from 'classnames';
import { useState } from 'react';
import './common.scss';
import './network.scss';

const networkType = ['devnet', 'mainnet'];

interface NetworkProps {
  type: string[];
}

function Network() {
  const [state, setState] = useState('devnet');

  return (
    <div className="network-setting-container">
      <div className="setting-title">Network</div>
      <div className="setting-desc">Switch between different network</div>
      {networkType.map((type) => {
        return (
          <div
            className={classnames('network-selection-container', {
              active: state === type,
            })}
            onClick={() => setState(type)}
            key={type}
          >
            <div className="network-selection-icon" />
            <span>{type}</span>
            <div className="network-selection-check" />
          </div>
        );
      })}
      <div>+ Add new custom network</div>
      <div className={classnames('setting-btn', 'wallet-save')}>Save</div>
      <div className={classnames('setting-btn', 'wallet-cancel')}>Cancel</div>
    </div>
  );
}

export default Network;
