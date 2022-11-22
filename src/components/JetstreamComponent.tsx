/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import InfoDialog from "./InfoDialog";
import PurgeDialog from "./PurgeDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/CleaningServicesOutlined";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import EditDialog from "./EditDialog";
import { SingleJetstream } from "../store/streams";

type props = {
  jetstream: SingleJetstream;
};

type showType = {
  [id: string]: boolean;
};

const JetstreamComponent = ({ jetstream }: props) => {
  const [showDialog, setShowDialog] = useState<showType>({
    remove: false,
    info: false,
    purge: false,
    edit: false,
  });

  const handleDialogs = (show: boolean, id: string) => {
    setShowDialog({ ...showDialog, [id]: show });
  };

  const subjectsArray: JSX.Element[] = [];
  let counter = 0;
  jetstream.stream?.config.subjects.map((subj: string) => {
    subjectsArray.push(
      <span className="subjects" key={counter}>
        {subj}
      </span>
    );
    counter++;
  });

  return (
    <>
      <div className="jetstream-card">
        <div className="jetstream-card-header">
          <div className="jetstream-name">{jetstream.stream?.config?.name}</div>
          <div className="jetstream-actions">
            <Tooltip title="Edit">
              <EditIcon
                id="edit"
                className="card-icon"
                fontSize="small"
                sx={{ color: "green" }}
                onClick={(e) => handleDialogs(true, e.currentTarget.id)}
              ></EditIcon>
            </Tooltip>
            <Tooltip title="Purge">
              <ClearIcon
                id="purge"
                className="card-icon"
                fontSize="small"
                sx={{ color: "orange" }}
                onClick={(e) => handleDialogs(true, e.currentTarget.id)}
              ></ClearIcon>
            </Tooltip>
            <Tooltip title="Info">
              <InfoIcon
                id="info"
                className="card-icon"
                fontSize="small"
                color="info"
                onClick={(e) => handleDialogs(true, e.currentTarget.id)}
              ></InfoIcon>
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteIcon
                id="remove"
                className="card-icon"
                fontSize="small"
                sx={{ color: "#d18091" }}
                onClick={(e) => handleDialogs(true, e.currentTarget.id)}
              ></DeleteIcon>
            </Tooltip>
          </div>
        </div>
        <div className="jetstream-content">
          <div className="jetstream-subject">{subjectsArray}</div>
          <div className="jetstream-additional">
            <div>Messages: {jetstream.stream?.state.messages}</div>
            <div>
              Active Consumers: {jetstream.stream?.state.consumer_count}
            </div>
          </div>
        </div>
        <div className="jetstream-footer"></div>
      </div>
      <DeleteDialog
        jetstream={jetstream.stream}
        open={showDialog.remove}
        handleShow={handleDialogs}
      ></DeleteDialog>
      <InfoDialog
        jetstream={jetstream}
        open={showDialog.info}
        handleShow={handleDialogs}
      ></InfoDialog>
      <PurgeDialog
        jetstream={jetstream.stream}
        open={showDialog.purge}
        handleShow={handleDialogs}
      ></PurgeDialog>
      <EditDialog
        jetstream={jetstream.stream}
        open={showDialog.edit}
        handleShow={handleDialogs}
      ></EditDialog>
    </>
  );
};

export default JetstreamComponent;
