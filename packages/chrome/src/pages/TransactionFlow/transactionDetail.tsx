import { useNavigate } from 'react-router-dom';
import './transactionDetail.scss';

function TransactionDetail() {
  const navigate = useNavigate();
  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-header">
        <div className="transaction-detail-icon"></div>
        <div className="transaction-detail-title">Sent</div>
      </div>
      <div className="transaction-detail-item-container">
        <div className="transaction-detail-item">
          <span>From</span>
          <span>iqAK3FwSZUSNZ...fY6a</span>
        </div>
        <div className="transaction-detail-item">
          <span>To</span>
          <span>iqAK3FwSZUSNZ...fY6a</span>
        </div>
        <div className="transaction-detail-item">
          <span>Id</span>
          <span>iqAK3FwSZUSNZ...fY6a</span>
        </div>
      </div>
      <div
        className="transaction-detail-btn"
        onClick={() => {
          navigate('/transaction/flow');
        }}
      >
        Back to list
      </div>
    </div>
  );
}

export default TransactionDetail;
