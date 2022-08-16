import Header from "./Header";
import Menu from "./Menu";
import styles from "./index.module.scss";
import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import {Spin} from 'antd';

function AppLayout() {
  const [activeTab, setActiveTab] = useState();
  return (
    <div className={styles['main-page']}>
      <Header />
      {/* child route view */}
        <Outlet />
      {/*<Suspense fallback={<Spin />}>*/}
      {/*</Suspense>*/}
      <Menu className="mt-auto" />
    </div>
  );
}

export default AppLayout;
