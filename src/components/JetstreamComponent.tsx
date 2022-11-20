/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import DeleteDialog from "./DeleteDialog";
import InfoDialog from "./InfoDialog";
import PurgeDialog from "./PurgeDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/CleaningServicesOutlined";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import EditDialog from "./EditDialog";
import { listJetstreams, SingleJetstream } from "../store/streams";
import { ConsumerInfo, StreamInfo } from "nats.ws";
import { useAppDispatch, useAppSelector } from "../hooks";

type props = {
  jetstream: SingleJetstream;
};
type Data = {
  streamName: string;
  messageCount: number;
  consumersCount: number;
};

const JetstreamComponent = ({ jetstream }: props) => {
  const { searchResults, jetstreamManager } = useAppSelector(
    (state) => state.streams
  );
  const dispatch = useAppDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showPurgeDialog, setShowPurgeDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [data, setData] = useState<Data>({
    streamName: "",
    messageCount: 0,
    consumersCount: 0,
  });

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

  // useEffect(() => {
  //   // (async () => {
  //   //   setData({
  //   //     streamName: jetstream.stream.config?.name,
  //   //     messageCount: jetstream.stream.state?.messages,
  //   //     consumersCount: jetstream.stream.state?.consumer_count,
  //   //   });
  //   //   console.log("test");
  //   // })();
  // }, []);
  // setData({
  //   streamName: stream.config?.name,
  //   messageCount: stream.state?.messages,
  //   consumersCount: stream.state?.consumer_count,
  // });
  // useEffect(() => {
  //   setData({
  //     streamName: jetstream.stream?.config?.name,
  //     messageCount: jetstream.stream?.state?.messages,
  //     consumersCount: jetstream.stream?.state?.consumer_count,
  //   });
  //   //if (jetstreamManager !== null) dispatch(listJetstreams(jetstreamManager));
  // }, [searchResults.length]);
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
                className="card-icon"
                fontSize="small"
                sx={{ color: "green" }}
                onClick={() => handleEditDialog(true)}
              ></EditIcon>
            </Tooltip>
            <Tooltip title="Purge">
              <ClearIcon
                className="card-icon"
                fontSize="small"
                sx={{ color: "orange" }}
                onClick={() => handlePurgeDialog(true)}
              ></ClearIcon>
            </Tooltip>
            <Tooltip title="Info">
              <InfoIcon
                className="card-icon"
                fontSize="small"
                color="info"
                onClick={() => handleInfoDialog(true)}
              ></InfoIcon>
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteIcon
                className="card-icon"
                fontSize="small"
                sx={{ color: "#d18091" }}
                onClick={() => handleDeleteDialog(true)}
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
            {/* <div>Messages: {data.messageCount}</div>
            <div>Active Consumers: {data.consumersCount}</div> */}
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
