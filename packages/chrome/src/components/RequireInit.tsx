import React, {useEffect} from 'react';
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {coreApi} from "@suiet/core";
import {isNonEmptyArray} from "../utils/check";
import {updateInitialized} from "../store/app-context";

function RequireInit({children}: any) {
  const initialized = useSelector((state: RootState) => state.appContext.initialized);
  const dispatch = useDispatch();

  async function adjustInitializedStatus() {
    const wallets = await coreApi.getWallets();
    if (!isNonEmptyArray(wallets) && initialized === true) {
      // adjust the global initialized status
      await dispatch(updateInitialized(false));
      return;
    }
    if (!initialized) {
      await dispatch(updateInitialized(true));
    }
  }

  useEffect(() => {
    adjustInitializedStatus();
  }, []);

  return initialized ? children : (
    <Navigate to={'/onboard'} replace />
)
}

export default RequireInit;