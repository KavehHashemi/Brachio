import React from "react";
import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddDialog from "./AddDialog";

const FAB = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const handleAddDialog = (show: boolean) => {
    setShowAddDialog(show);
  };
  return (
    <>
      <Fab onClick={() => handleAddDialog(true)} className="fab">
        <AddIcon sx={{ color: "#fff" }} />
      </Fab>
      <AddDialog open={showAddDialog} openHandler={handleAddDialog}></AddDialog>
    </>
  );
};

export default FAB;
