import React, {useEffect} from 'react';
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store";
import {coreApi} from "@suiet/core";
import {isNonEmptyArray} from "../utils/check";
import {resetAppContext, updateInitialized} from "../store/app-context";

function RequireInit({children}: any) {
  const initialized = useSelector((state: RootState) => state.appContext.initialized);
  const dispatch = useDispatch<AppDispatch>();

  async function adjustInitializedStatus() {
    const wallets = await coreApi.getWallets();
    if (isNonEmptyArray(wallets)) {
      if (!initialized) {
        await dispatch(updateInitialized(true));
      }
    } else {
      await dispatch(resetAppContext());
    }
  }

  useEffect(() => {
    adjustInitializedStatus();
  }, []);

  console.log('initialized', initialized)

  return initialized ? children : (
    <Navigate to={'/onboard'} replace />
)
}

export default RequireInit;