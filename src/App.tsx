import { useState } from "react";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MainPage />
    </>
  );
}

export default App;
