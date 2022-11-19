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
import EditDialog from "./EditDialog";
import { SingleJetstream } from "../store/streams";

type props = {
  jetstream: SingleJetstream;
};

const JetstreamComponent = ({ jetstream }: props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showPurgeDialog, setShowPurgeDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDeleteDialog = (show: boolean) => {
    setShowDeleteDialog(show);
  };
  const handleInfoDialog = (show: boolean) => {
    setShowInfoDialog(show);
  };
  const handlePurgeDialog = (show: boolean) => {
    setShowPurgeDialog(show);
  };
  const handleEditDialog = (show: boolean) => {
    setShowEditDialog(show);
  };

  const subjectsArray: JSX.Element[] = [];
  let counter = 0;
  jetstream.stream.config.subjects.map((subj: string) => {
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
          <div className="jetstream-name">
            {jetstream?.stream?.config?.name}
          </div>
          <div className="jetstream-actions">
            <EditIcon
              className="card-icon"
              fontSize="small"
              sx={{ color: "green" }}
              onClick={() => handleEditDialog(true)}
            ></EditIcon>
            <ClearIcon
              className="card-icon"
              fontSize="small"
              sx={{ color: "orange" }}
              onClick={() => handlePurgeDialog(true)}
            ></ClearIcon>
            <InfoIcon
              className="card-icon"
              fontSize="small"
              color="info"
              onClick={() => handleInfoDialog(true)}
            ></InfoIcon>
            <DeleteIcon
              className="card-icon"
              fontSize="small"
              sx={{ color: "#d18091" }}
              onClick={() => handleDeleteDialog(true)}
            ></DeleteIcon>
          </div>
        </div>
        <div className="jetstream-content">
          <div className="jetstream-subject">{subjectsArray}</div>
          <div className="jetstream-additional">
            <div>Messages: {jetstream.stream.state.messages}</div>
            <div>Active Consumers: {jetstream.stream.state.consumer_count}</div>
          </div>
        </div>
        <div className="jetstream-footer"></div>
      </div>
      <DeleteDialog
        jetstream={jetstream.stream}
        open={showDeleteDialog}
        handleShow={handleDeleteDialog}
      ></DeleteDialog>
      <InfoDialog
        jetstream={jetstream}
        open={showInfoDialog}
        handleShow={handleInfoDialog}
      ></InfoDialog>
      <PurgeDialog
        jetstream={jetstream.stream}
        open={showPurgeDialog}
        handleShow={handlePurgeDialog}
      ></PurgeDialog>
      <EditDialog
        jetstream={jetstream.stream}
        open={showEditDialog}
        handleShow={handleEditDialog}
      ></EditDialog>
    </>
  );
};

export default JetstreamComponent;
