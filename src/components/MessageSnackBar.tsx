import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearMessage } from "../store/streams";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const MessageComponent = () => {
  const { message } = useAppSelector((state) => state.streams);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (message !== null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [message]);

  const close = () => {
    setOpen(false);
    dispatch(clearMessage());
  };
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={close}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        className="error-snack"
      >
        <MuiAlert onClose={close} severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default MessageComponent;
