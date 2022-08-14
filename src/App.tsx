import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
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
