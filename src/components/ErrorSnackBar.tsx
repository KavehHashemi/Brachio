import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearErrorMessage } from "../store/streams";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const ErrorComponent = () => {
  const { errorMessage } = useAppSelector((state) => state.streams);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (errorMessage !== null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [errorMessage]);

  const close = () => {
    setOpen(false);
    dispatch(clearErrorMessage());
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
        <MuiAlert onClose={close} severity="error">
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default ErrorComponent;
