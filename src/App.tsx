/* eslint-disable react-hooks/exhaustive-deps */
import SearchComponent from "./components/SearchComponent";
import JetstreamsComponent from "./components/JetstreamsComponent";
import FooterComponent from "./components/FooterComponent";
import ErrorSnackBar from "./components/ErrorSnackBar";
import FAB from "./components/FAB";
import data from "./connectionconfig.json";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setJetstreamManager, connecToServer } from "./store/streams";
import { useEffect } from "react";
const App = () => {
  const dispatch = useAppDispatch();
  const { natsConnection } = useAppSelector((state) => state.streams);

  useEffect(() => {
    dispatch(connecToServer(data.serverUrl));
  }, []);

  useEffect(() => {
    if (natsConnection !== undefined) {
      dispatch(setJetstreamManager(natsConnection));
    }
  }, [natsConnection]);

  return (
    <>
      <SearchComponent></SearchComponent>
      <JetstreamsComponent></JetstreamsComponent>
      <FooterComponent></FooterComponent>
      <FAB></FAB>
      <ErrorSnackBar></ErrorSnackBar>
    </>
  );
};

export default App;
