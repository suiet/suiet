import React, {lazy} from "react";
import {Route, Routes} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import {withSus} from "./components/TheSuspense";
import "./App.css";

const MainPage = lazy(() => import("./pages/MainPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SettingPage = lazy(() => import("./pages/SettingsPage"));
const SendPage = lazy(() => import("./pages/SendPage"));

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={withSus(<MainPage />)} />
          <Route path={'send'} element={withSus(<SendPage />)} />
        </Route>
        <Route path='login' element={withSus(<LoginPage />)} />
        <Route path='settings' element={withSus(<SettingPage />)} />
      </Routes>
    </div>
  );
}

export default App;
