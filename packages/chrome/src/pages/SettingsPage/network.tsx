import classnames from 'classnames';
import { useState } from 'react';
import './common.scss';
import './network.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
const networkType = ['devnet', 'mainnet'];

interface NetworkProps {
  type: string[];
}

function Network() {
  const [state, setState] = useState('devnet');
  const navigate = useNavigate();

  return (
    <div className="network-setting-container">
      <div className="flex justify-end items-center h-14">
        <div className="setting-cancel" onClick={() => navigate('..')}></div>
      </div>
      <div className="setting-title">Network</div>
      <div className="setting-desc">Switch between different network</div>
      {networkType.map((type) => {
        return (
          <div
            className={classnames('network-selection-container', {
              active: state === type,
            })}
            onClick={() => {
              if (type === 'mainnet') return;
              setState(type);
            }}
            key={type}
          >
            <div className="network-selection-icon" />
            <span>{type}</span>
            <div className="network-selection-check" />
          </div>
        );
      })}
      <div>+ Add new custom network</div>
      <div className="flex flex-col gap-2 mt-2 absolute bottom-12 w-full px-8 left-0">
        <Button state="primary" onClick={() => navigate('..')}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default Network;
