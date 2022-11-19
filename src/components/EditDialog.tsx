import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { editStream, listJetstreams } from "../store/streams";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { StreamInfo } from "nats.ws";

type props = {
  open: boolean;
  handleShow: (show: boolean) => void;
  jetstream: StreamInfo;
};

const EditDialog = ({ open, handleShow, jetstream }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager } = useAppSelector((state) => state.streams);
  const [subjects, setSubjects] = useState(jetstream.config.subjects);
  const editJetstream = async () => {
    const config = {
      stream: jetstream.config.name,
      jetstreamManager: jetstreamManager,
      subjects: subjects,
    };
    await dispatch(editStream(config));
    if (jetstreamManager !== null) {
      dispatch(listJetstreams(jetstreamManager));
    }

    handleShow(false);
  };

  const handleChange = (entry: string) => {
    let array = entry.split(",");
    setSubjects(array);
  };
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={() => handleShow(false)}
      >
        <DialogTitle>{`Edit Jetstream ${jetstream?.config.name}`}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={subjects}
            onChange={(e) => handleChange(e.target.value)}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleShow(false)}>Cancel</Button>
          <Button onClick={editJetstream}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDialog;
