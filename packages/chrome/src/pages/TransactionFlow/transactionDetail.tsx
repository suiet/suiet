import { useNavigate } from 'react-router-dom';

function TransactionDetail() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <div></div>
        <div>Sent</div>
      </div>
      <div />
      <div></div>
      <div
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
