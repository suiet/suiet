import TransactionItem from "./TransactionItem";
import "./index.scss";

const list = [
  {
    id: 1,
    type: "sent",
    to: "0xiasd...asdas",
    amount: 2000,
  },
  {
    id: 2,
    type: "received",
    to: "0xiasd...asdas",
    amount: 2000,
  },
  {
    id: 3,
    type: "airdroped",
    to: "0xiasd...asdas",
    amount: 2000,
  },
];

function TransacationFlow() {
  return (
    <div>
      <div className="transaction-time">last week</div>
      <div>
        {list.map(({ to, type, amount, id }, index) => {
          return (
            <TransactionItem key={id} to={to} amount={amount} type={type} />
          );
        })}
      </div>
    </div>
  );
}

export default TransacationFlow;
