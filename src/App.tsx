/* eslint-disable react-hooks/exhaustive-deps */
import SearchComponent from "./components/SearchComponent";
import JetstreamsComponent from "./components/JetstreamsComponent";
import FooterComponent from "./components/FooterComponent";
import ErrorSnackBar from "./components/ErrorSnackBar";
import MessageSnackBar from "./components/MessageSnackBar";
import FAB from "./components/FAB";
import data from "./connectionconfig.json";
import { connectionStatuses } from "./Enums";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  setJetstreamManager,
  connecToServer,
  serverTimeOut,
} from "./store/streams";
import { useEffect, useState } from "react";

const App = () => {
  const dispatch = useAppDispatch();
  const { natsConnection, connectionStatus } = useAppSelector(
    (state) => state.streams
  );
  const [triesCounter, setTriesCounter] = useState<number>(1);
  const [footerMessage, setFooterMessage] = useState<string>("");

  useEffect(() => {
    connectionHandler();
  }, [connectionStatus]);

  const connectionHandler = () => {
    switch (connectionStatus) {
      case connectionStatuses.notConnected:
        setFooterMessage(connectionStatus);
        dispatch(connecToServer(data.serverUrl));
        break;
      case connectionStatuses.Connecting:
        setFooterMessage(`${connectionStatus}...`);
        break;
      case connectionStatuses.Connected:
        setFooterMessage(connectionStatus);
        if (natsConnection !== undefined) {
          dispatch(setJetstreamManager(natsConnection));
        }
        break;
      case connectionStatuses.Failed:
        setFooterMessage(`Connection to server failed. Retrying in 5 seconds.`);
        setTimeout(() => {
          if (triesCounter < 10) {
            setFooterMessage(`Reconnecting...${triesCounter}/10`);
            dispatch(connecToServer(data.serverUrl));
            setTriesCounter(triesCounter + 1);
          } else {
            dispatch(serverTimeOut());
            setFooterMessage(connectionStatus);
          }
        }, 5000);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <SearchComponent></SearchComponent>
      <JetstreamsComponent></JetstreamsComponent>
      <FooterComponent footerMessage={footerMessage}></FooterComponent>
      <FAB></FAB>
      <ErrorSnackBar></ErrorSnackBar>
      <MessageSnackBar></MessageSnackBar>
    </>
  );
};

export default App;
