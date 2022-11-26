import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addNewJetstream, AddStreamConfig } from "../store/streams";
import { Tooltips } from "../Enums";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import {
  StorageType,
  RetentionPolicy,
  DiscardPolicy,
  StreamConfig,
} from "nats.ws";

type props = {
  open: boolean;
  openHandler: (show: boolean) => void;
};

const initialState: StreamConfig = {
  name: "",
  subjects: [],
  storage: StorageType.File,
  num_replicas: 1,
  retention: RetentionPolicy.Limits,
  discard: DiscardPolicy.Old,
  max_msgs: -1,
  max_msgs_per_subject: -1,
  max_bytes: -1,
  max_age: 0,
  max_msg_size: -1,
  duplicate_window: 0,
  allow_rollup_hdrs: false,
  deny_delete: false,
  deny_purge: false,
  ///
  allow_direct: true,
  discard_new_per_subject: true,
  max_consumers: -1,
  mirror_direct: true,
  sealed: false,
};

const AddDialog = ({ open, openHandler }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager } = useAppSelector((state) => state.streams);
  const [streamConfig, setStreamConfig] = useState<StreamConfig>(initialState);

  const addJetstream = async () => {
    let config: AddStreamConfig = {
      jetstreamManager: jetstreamManager,
      streamConfig: streamConfig,
    };
    dispatch(addNewJetstream(config));
  };

  const setMultipleSubjects = (subjectsArray: string) => {
    let array = subjectsArray.split(",");
    setStreamConfig({ ...streamConfig, subjects: array });
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={open}
      onClose={() => {
        openHandler(false);
      }}
    >
      <DialogTitle>{"Add a new jetstream"}</DialogTitle>
      <DialogContent style={{ padding: "0.5rem 1.5rem" }}>
        <FormControl
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div className="addjet-section">
            <div className="addjet-name">
              <TextField
                autoFocus
                margin="normal"
                size="small"
                fullWidth
                label="Jetstream Name"
                type="text"
                variant="outlined"
                value={streamConfig.name}
                onChange={(e) =>
                  setStreamConfig({ ...streamConfig, name: e.target.value })
                }
              />
            </div>
            <div className="addjet-subject">
              <TextField
                margin="normal"
                size="small"
                fullWidth
                label="Subject"
                type="text"
                variant="outlined"
                value={streamConfig.subjects}
                onChange={(e) => setMultipleSubjects(e.target.value)}
              />
              <Tooltip title={Tooltips.subject}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
          </div>
          <div className="addjet-section">
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Storage</FormLabel>
                <Tooltip title={Tooltips.storage}>
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                value={streamConfig.storage}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    storage: e.target.value as StorageType,
                  })
                }
              >
                <FormControlLabel
                  value={StorageType.File}
                  control={<Radio size="small" />}
                  label="File"
                />
                <FormControlLabel
                  value={StorageType.Memory}
                  control={<Radio size="small" />}
                  label="Memory"
                />
              </RadioGroup>
            </div>
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Discard Policy</FormLabel>
                <Tooltip title={Tooltips.discard}>
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                value={streamConfig.discard}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    discard: e.target.value as DiscardPolicy,
                  })
                }
              >
                <FormControlLabel
                  value={DiscardPolicy.Old}
                  control={<Radio size="small" />}
                  label="Old"
                />
                <FormControlLabel
                  value={DiscardPolicy.New}
                  control={<Radio size="small" />}
                  label="New"
                />
              </RadioGroup>
            </div>
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Retention Policy</FormLabel>
                <Tooltip title={Tooltips.retention}>
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                className="radio-group-font"
                value={streamConfig.retention}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    retention: e.target.value as RetentionPolicy,
                  })
                }
              >
                <FormControlLabel
                  className="radio-group-font"
                  value={RetentionPolicy.Limits}
                  control={<Radio size="small" />}
                  label="Limits"
                />
                <FormControlLabel
                  className="radio-group-font"
                  value={RetentionPolicy.Interest}
                  control={<Radio size="small" />}
                  label="Interest"
                />
                <FormControlLabel
                  className="radio-group-font"
                  value={RetentionPolicy.Workqueue}
                  control={<Radio size="small" />}
                  label="Work Queue"
                />
              </RadioGroup>
            </div>
          </div>
          <div className="addjet-section">
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Replication"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.num_replicas}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    num_replicas: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.replicas}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Messages Limit"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.max_msgs}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    max_msgs: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.max_msgs}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Per Subject Messages Limit"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.max_msgs_per_subject}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    max_msgs_per_subject: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.max_msgs_per_subject}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Total Stream Size"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.max_bytes}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    max_bytes: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.max_bytes}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Message TTL"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.max_age}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    max_age: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.max_age}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Max Message Size"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.max_msg_size}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    max_msg_size: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.max_msg_size}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                label="Duplicate Tracking Time Window"
                type="number"
                fullWidth
                variant="outlined"
                value={streamConfig.duplicate_window}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    duplicate_window: Number(e.target.value),
                  })
                }
              />
              <Tooltip title={Tooltips.duplicate_window}>
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
          </div>
          <div className="addjet-section">
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Allow Message Roll-Ups</FormLabel>
              </div>
              <Switch
                size="small"
                checked={streamConfig.allow_rollup_hdrs}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    allow_rollup_hdrs: e.target.checked,
                  })
                }
              ></Switch>
            </div>
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Deny Message Deletion</FormLabel>
              </div>
              <Switch
                size="small"
                checked={streamConfig.deny_delete}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    deny_delete: e.target.checked,
                  })
                }
              ></Switch>
            </div>
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Deny Purge</FormLabel>
              </div>
              <Switch
                size="small"
                checked={streamConfig.deny_purge}
                onChange={(e) =>
                  setStreamConfig({
                    ...streamConfig,
                    deny_purge: e.target.checked,
                  })
                }
              ></Switch>
            </div>
          </div>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => openHandler(false)}>Cancel</Button>
        <Button
          onClick={async () => {
            await addJetstream();
            openHandler(false);
            setStreamConfig(initialState);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
