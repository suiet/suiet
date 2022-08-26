import React from 'react';
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";

function RequireInit({children}: any) {
  const initialized = useSelector((state: RootState) => state.appContext.initialized);

  return initialized ? children : (
    <Navigate to={'/onboard'} replace />
)
}

export default RequireInit;