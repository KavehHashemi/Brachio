/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

import { SingleJetstream } from "../store/streams";

type props = {
  open: boolean;
  handleShow: (show: boolean) => void;
  jetstream: SingleJetstream;
};

const InfoDialog = ({ open, handleShow, jetstream }: props) => {
  let consumersList: JSX.Element[] = [];
  let consumerCounter: number = 0;
  jetstream.consumers?.forEach((con) => {
    consumersList.push(
      <span style={{ marginInline: "4px" }} key={consumerCounter}>
        {con?.name}
      </span>
    );
    consumerCounter++;
  });

  let subjectsArray: JSX.Element[] = [];
  let subjectsCounter: number = 0;
  jetstream?.stream?.config?.subjects.forEach((sub) => {
    subjectsArray.push(
      <span style={{ marginInline: "4px" }} key={subjectsCounter}>
        {sub}
      </span>
    );
    subjectsCounter++;
  });
  return (
    <Dialog
      fullWidth={true}
      maxWidth={false}
      open={open}
      onClose={() => handleShow(false)}
    >
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {`${jetstream?.stream?.config?.name}'s details`}
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={() => handleShow(false)}
          ></CloseIcon>
        </div>
      </DialogTitle>
      <DialogContent>
        <div id="details-container">
          {/* <ConsumersComponent jetstream={jetstream}></ConsumersComponent> */}
          <p>consumers: {consumersList}</p>
          <p>name: {jetstream?.stream?.config.name}</p>
          <p style={{ display: "flex" }}>subjects: {subjectsArray}</p>
          <p>retention: {jetstream?.stream?.config.retention}</p>
          <p>max. consumers: {jetstream?.stream?.config.max_consumers}</p>
          <p>max. messages: {jetstream?.stream?.config.max_msgs}</p>
          <p>max. bytes: {jetstream?.stream?.config.max_bytes}</p>
          <p>max. age: {jetstream?.stream?.config.max_age}</p>
          <p>
            max. messages per subject:{" "}
            {jetstream?.stream?.config.max_msgs_per_subject}
          </p>
          <p>max. message size:{jetstream?.stream?.config.max_msg_size}</p>
          <p>discard: {jetstream?.stream?.config.discard}</p>
          <p>storage: {jetstream?.stream?.config.storage}</p>
          <p>number of replicas: {jetstream?.stream?.config.num_replicas}</p>
          <p>duplicate window: {jetstream?.stream?.config.duplicate_window}</p>
          <p>sealed: {jetstream?.stream?.config.sealed?.toString()}</p>
          <p>
            deny delete: {jetstream?.stream?.config.deny_delete?.toString()}
          </p>
          <p>deny purge: {jetstream?.stream?.config.deny_purge?.toString()}</p>
          <p>
            allow rollup headers:{" "}
            {jetstream?.stream?.config.allow_rollup_hdrs?.toString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
