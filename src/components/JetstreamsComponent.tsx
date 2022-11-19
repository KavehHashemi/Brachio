/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useEffect } from "react";
import { Nuid } from "nats.ws";
import JetstreamComponent from "./JetstreamComponent";
import { listJetstreams } from "../store/streams";
import { useAppDispatch, useAppSelector } from "../hooks";

const JetstreamsComponent = () => {
  const dispatch = useAppDispatch();
  const { jetstreamManager, searchResults } = useAppSelector(
    (state) => state.streams
  );

  useEffect(() => {
    if (jetstreamManager !== null) dispatch(listJetstreams(jetstreamManager));
  }, [jetstreamManager]);

  const jetstreamArray: JSX.Element[] = [];
  searchResults.forEach((js) => {
    jetstreamArray.push(
      <JetstreamComponent
        jetstream={js}
        key={new Nuid().seq}
      ></JetstreamComponent>
    );
  });

  return (
    <div className="jetstream-container">
      <div className="jetstream-header">
        <div>Jetstreams</div>
      </div>
      <div className="jetstream-list">{jetstreamArray}</div>
    </div>
  );
};

export default JetstreamsComponent;
