import React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addNewJetstream } from "../store/streams";
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

type props = {
  open: boolean;
  openHandler: (show: boolean) => void;
};

const AddDialog = ({ open, openHandler }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager } = useAppSelector((state: any) => state.streams);

  const [jetstreamName, setJetstreamName] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);

  const [storage, setStorage] = useState<string>("file");
  const [replication, setReplication] = useState<number>(1);
  const [retentionPolicy, setRetentionPolicy] = useState<string>("limits");
  const [discardPolicy, setDiscardPolicy] = useState<string>("old");
  const [messagesLimit, setMessagesLimit] = useState<number>(-1);
  const [perSubjectMessagesLimit, setPerSubjectMessagesLimit] = useState(-1);
  const [totalStreamsize, setTotalStreamsize] = useState(-1);
  const [messageTTL, setMessageTTL] = useState(0);
  const [maxMessageSize, setMaxMessageSize] = useState(-1);
  const [duplicateTrackingTimeWindow, setDuplicateTrackingTimeWindow] =
    useState(0);
  const [allowMessageRollUps, setAllowMessageRollUps] =
    useState<boolean>(false);
  const [allowMessageDeletion, setAllowMessageDeletion] =
    useState<boolean>(true);
  const [allowPurge, setAllowPurge] = useState<boolean>(true);

  const addJetstream = () => {
    let config = {
      jetstreamManager: jetstreamManager,
      name: jetstreamName,
      // subjects: [subject],
      subjects: subjects,
      storage: storage,
      replication: replication,
      retentionPolicy: retentionPolicy,
      discardPolicy: discardPolicy,
      messagesLimit: messagesLimit,
      perSubjectMessagesLimit: perSubjectMessagesLimit,
      totalStreamsize: totalStreamsize,
      messageTTL: messageTTL,
      maxMessageSize: maxMessageSize,
      duplicateTrackingTimeWindow: duplicateTrackingTimeWindow,
      allowMessageRollUps: !allowMessageRollUps,
      allowMessageDeletion: !allowMessageDeletion,
      allowPurge: !allowPurge,
    };
    dispatch(addNewJetstream(config));
  };

  const setMultipleSubjects = (subjectsArray: string) => {
    let array = subjectsArray.split(",");
    setSubjects(array);
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
                // sx={{ width: "45%" }}
                value={jetstreamName}
                onChange={(e) => setJetstreamName(e.target.value)}
              />
            </div>
            <div className="addjet-subject">
              <TextField
                margin="normal"
                size="small"
                fullWidth
                // sx={{ width: "100%" }}
                label="Subject"
                type="text"
                variant="outlined"
                value={subjects}
                onChange={(e) => setMultipleSubjects(e.target.value)}
              />
              <Tooltip title="Streams consume messages from subjects, this is a comma separated list that can include wildcards.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
          </div>
          <div className="addjet-section">
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Storage</FormLabel>
                <Tooltip title="Streams are stored on the server, this can be one of many backends and all are usable in clustering mode.">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                <FormControlLabel
                  value="file"
                  control={<Radio size="small" />}
                  label="File"
                />
                <FormControlLabel
                  value="memory"
                  control={<Radio size="small" />}
                  label="Memory"
                />
              </RadioGroup>
            </div>
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Discard Policy</FormLabel>
                <Tooltip title="Once the Stream reach it's limits of size or messages the New policy will prevent further messages from being added while Old will delete old messages.">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                value={discardPolicy}
                onChange={(e) => setDiscardPolicy(e.target.value)}
              >
                <FormControlLabel
                  value="old"
                  control={<Radio size="small" />}
                  label="Old"
                />
                <FormControlLabel
                  value="new"
                  control={<Radio size="small" />}
                  label="New"
                />
              </RadioGroup>
            </div>
            <div className="radio-group">
              <div className="radio-group-header">
                <FormLabel>Retention Policy</FormLabel>
                <Tooltip title="Messages are retained either based on limits like size and age (Limits), as long as there are Consumers (Interest) or until any worker processed them (Work Queue).">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <RadioGroup
                row
                className="radio-group-font"
                value={retentionPolicy}
                onChange={(e) => setRetentionPolicy(e.target.value)}
              >
                <FormControlLabel
                  className="radio-group-font"
                  value="limits"
                  control={<Radio size="small" />}
                  label="Limits"
                />
                <FormControlLabel
                  className="radio-group-font"
                  value="interest"
                  control={<Radio size="small" />}
                  label="Interest"
                />
                <FormControlLabel
                  className="radio-group-font"
                  value="workqueue"
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
                // sx={{ width: "25%" }}
                label="Replication"
                type="number"
                fullWidth
                variant="outlined"
                value={replication}
                onChange={(e) => setReplication(Number(e.target.value))}
              />
              <Tooltip title="When clustered, defines how many replicas of the data to store.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Messages Limit"
                type="number"
                fullWidth
                variant="outlined"
                value={messagesLimit}
                onChange={(e) => setMessagesLimit(Number(e.target.value))}
              />
              <Tooltip title="Defines the amount of messages to keep in the store for this Stream, when exceeded oldest messages are removed, -1 for unlimited.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Per Subject Messages Limit"
                type="number"
                fullWidth
                variant="outlined"
                value={perSubjectMessagesLimit}
                onChange={(e) =>
                  setPerSubjectMessagesLimit(Number(e.target.value))
                }
              />
              <Tooltip title=" Defines the amount of messages to keep in the store for this Stream per unique subject, when exceeded oldest messages are removed, -1 for unlimited.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Total Stream Size"
                type="number"
                fullWidth
                variant="outlined"
                value={totalStreamsize}
                onChange={(e) => setTotalStreamsize(Number(e.target.value))}
              />
              <Tooltip title="Defines the combined size of all messages in a Stream, when exceeded messages are removed or new ones are rejected, -1 for unlimited.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Message TTL"
                type="number"
                fullWidth
                variant="outlined"
                value={messageTTL}
                onChange={(e) => setMessageTTL(Number(e.target.value))}
              />
              <Tooltip title="Defines the oldest messages that can be stored in the Stream, any messages older than this period will be removed, -1 for unlimited.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Max Message Size"
                type="number"
                fullWidth
                variant="outlined"
                value={maxMessageSize}
                onChange={(e) => setMaxMessageSize(Number(e.target.value))}
              />
              <Tooltip title="Defines the maximum size any single message may be to be accepted by the Stream.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
            <div className="textfiled-group">
              <TextField
                margin="normal"
                size="small"
                // sx={{ width: "25%" }}
                label="Duplicate Tracking Time Window"
                type="number"
                fullWidth
                variant="outlined"
                value={duplicateTrackingTimeWindow}
                onChange={(e) =>
                  setDuplicateTrackingTimeWindow(Number(e.target.value))
                }
              />
              <Tooltip title="Duplicate messages are identified by the Msg-Id headers and tracked within a window of this size.">
                <InfoIcon fontSize="small" sx={{ color: "skyblue" }}></InfoIcon>
              </Tooltip>
            </div>
          </div>
          <div className="addjet-section">
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Allow Message Roll-Ups</FormLabel>
                <Tooltip title="Storage Type">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <Switch
                size="small"
                checked={allowMessageRollUps}
                onChange={(e) => setAllowMessageRollUps(e.target.checked)}
              ></Switch>
            </div>
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Allow Message Deletion</FormLabel>
                <Tooltip title="Storage Type">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <Switch
                size="small"
                checked={allowMessageDeletion}
                onChange={(e) => setAllowMessageDeletion(e.target.checked)}
              ></Switch>
            </div>
            <div className="switch-group">
              <div className="radio-group-header">
                <FormLabel>Allow Purge</FormLabel>
                <Tooltip title="Storage Type">
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: "skyblue" }}
                  ></InfoIcon>
                </Tooltip>
              </div>
              <Switch
                size="small"
                checked={allowPurge}
                onChange={(e) => setAllowPurge(e.target.checked)}
              ></Switch>
            </div>
          </div>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => openHandler(false)}>Cancel</Button>
        <Button
          onClick={() => {
            addJetstream();
            openHandler(false);
            setJetstreamName("");
            setSubjects([]);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
