import { NatsConnectionImpl } from "nats.ws/lib/nats-base-client/nats";
import { useAppSelector } from "../hooks";

type props = {
  footerMessage: string;
};

const FooterComponent = ({ footerMessage }: props) => {
  const { natsConnection } = useAppSelector((state) => state.streams);
  let connectedServer: string | undefined;
  let nci = natsConnection as NatsConnectionImpl;
  if (natsConnection !== undefined) {
    connectedServer = nci.protocol.connected ? nci.protocol.server.listen : "";
  }

  return (
    <div className="footer">
      <div className="info">
        <span className="info-span">{footerMessage}</span>
        <span className="info-span">{connectedServer}</span>
      </div>
    </div>
  );
};

export default FooterComponent;
