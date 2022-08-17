import styles from "./index.module.scss";
import TokenList from "./TokenList";
import Dashboard from "./Dashboard";

function MainPage() {
  return (
    <div>
      <Dashboard /> 
      <TokenList />
    </div>
  );
}

export default MainPage;
