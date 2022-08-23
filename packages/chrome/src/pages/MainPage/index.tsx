import TokenList from "./TokenList";
import Dashboard from "./Dashboard";
import {useContext, useEffect} from "react";
import {AppContext} from "../../App";
import {useNavigate} from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (!appContext.password) {
      navigate('/onboard');
    }
  }, []);

  return (
    <div>
      <Dashboard /> 
      <TokenList />
    </div>
  );
}

export default MainPage;
