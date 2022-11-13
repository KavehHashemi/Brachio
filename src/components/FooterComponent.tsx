import { useAppSelector } from "../hooks";

const FooterComponent = () => {
  const { jsm } = useAppSelector((state) => state.streams);
  let connectionStatus;
  let connectedServer;

  if (jsm !== undefined) {
    connectionStatus = jsm.nc.protocol.connected
      ? "Connected"
      : jsm.nc.protocol.connectError?.toString();
    connectedServer = jsm.nc.protocol.connected
      ? jsm.nc.protocol.server.listen
      : "";
  }

  return (
    <div className="header">
      <div className="info">
        <span className="info-span">{connectionStatus}</span>
        <span className="info-span">{connectedServer}</span>
      </div>
    </div>
  );
};

export default FooterComponent;
