import { useAppDispatch, useAppSelector } from "../hooks";
import {
  purgeStream,
  listJetstreams,
  PurgeStreamConfig,
} from "../store/streams";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { StreamInfo } from "nats.ws";

type props = {
  open: boolean;
  handleShow: (show: boolean, id: string) => void;
  jetstream: StreamInfo;
};

const PurgeDialog = ({ open, handleShow, jetstream }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager } = useAppSelector((state) => state.streams);
  const purgeJetstream = () => {
    const config: PurgeStreamConfig = {
      stream: jetstream.config?.name,
      jetstreamManager: jetstreamManager,
    };
    dispatch(purgeStream(config));
    if (jetstreamManager !== null) {
      dispatch(listJetstreams(jetstreamManager));
    }
    handleShow(false, "purge");
  };
  return (
    <div>
      <Dialog open={open} onClose={() => handleShow(false, "purge")}>
        <DialogTitle>{"Purge Jetstream"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to purge ${jetstream?.config?.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleShow(false, "purge")}>Cancel</Button>
          <Button onClick={purgeJetstream}>Purge</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PurgeDialog;
