import { NatsConnectionImpl } from "nats.ws/lib/nats-base-client/nats";
import { useAppSelector } from "../hooks";

const FooterComponent = () => {
  const { natsConnection } = useAppSelector((state) => state.streams);
  let connectedServer: string | undefined;
  let connectionStatus: string | undefined;
  let nci = natsConnection as NatsConnectionImpl;

  if (natsConnection !== undefined) {
    connectionStatus = nci.protocol.connected
      ? "Connected"
      : "Connection Failed";
    connectedServer = nci.protocol.connected ? nci.protocol.server.listen : "";
  }

  return (
    <div className="footer">
      <div className="info">
        <span className="info-span">{connectionStatus}</span>
        <span className="info-span">{connectedServer}</span>
      </div>
    </div>
  );
};

export default FooterComponent;
