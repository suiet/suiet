import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
// import {createNewWallet} from "@suiet/core";

export class ChromeStorage {
  get(key) {
    return localStorage.getItem(key);
  }
  getSync(key) {
    return localStorage.getItem(key);
  }
  remove(key) {
    return localStorage.removeItem(key);
  }
  removeSync(key) {
    return localStorage.removeItem(key);
  }

  set(key, value) {
    return localStorage.setItem(key, value);
  }
  setSync(key, value) {
    return localStorage.setItem(key, value);
  }
}

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const storage = new ChromeStorage();
    // createNewWallet()
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
