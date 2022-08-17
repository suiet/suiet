import Header from "./Header";
import Menu from "./Menu";
import styles from "./index.module.scss";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function AppLayout() {
  const [activeTab, setActiveTab] = useState();
  return (
    <div className={styles['main-page']}>
      <Header />
      {/* child route view */}
      <Outlet />
      <Menu className="mt-auto" />
    </div>
  );
}

export default AppLayout;
