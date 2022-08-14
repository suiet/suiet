import Header from "./Header";
import Menu from "./Menu";
import styles from "./index.module.scss";
import TokenList from "./TokenList";
import Dashboard from "./Dashboard";

function MainPage() {
  return (
    <div className={styles['main-page']}>
      <Header />
      <Dashboard /> 
      <TokenList />
      <Menu className="mt-auto" />
    </div>
  );
}

export default MainPage;
