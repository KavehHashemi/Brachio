import SearchComponent from "./components/SearchComponent";
import JetstreamsComponent from "./components/JetstreamsComponent";
import FooterComponent from "./components/FooterComponent";
import ErrorSnackBar from "./components/ErrorSnackBar";
import FAB from "./components/FAB";
import data from "./connectionconfig.json";
import { useAppDispatch } from "./hooks";
import { setUpConnection } from "./store/streams";
const App = () => {
  const dispatch = useAppDispatch();
  dispatch(setUpConnection(data.serverUrl));
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
