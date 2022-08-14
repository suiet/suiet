import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
