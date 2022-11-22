import { useAppDispatch, useAppSelector } from "../hooks";
import { removeJetstream, listJetstreams } from "../store/streams";
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

const DeleteDialog = ({ open, handleShow, jetstream }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager } = useAppSelector((state) => state.streams);
  const deleteJetstream = () => {
    dispatch(removeJetstream(jetstream?.config?.name));
    if (jetstreamManager !== null) {
      dispatch(listJetstreams(jetstreamManager));
    }
    handleShow(false, "remove");
  };
  return (
    <div>
      <Dialog open={open} onClose={() => handleShow(false, "remove")}>
        <DialogTitle>{"Delete Jetstream"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete jetstream ${jetstream?.config?.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleShow(false, "remove")}>Cancel</Button>
          <Button onClick={deleteJetstream}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
