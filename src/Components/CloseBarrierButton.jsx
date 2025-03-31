import React, { useState } from 'react';
import { Button, CircularProgress, Backdrop } from '@mui/material';
import { CloseBarrier } from '../BarrierControllers/BarrierController';


const CloseBarrierButton = ({ onStartClose, onClosing, onCloseCompleted, onCloseFailed }) => {
  const [loading, setLoading] = useState(false);
  const handleOpenBarrier = async () => {
    setLoading(true);
    CloseBarrier({
      onStartClose: () => {
        if(onStartClose) onStartClose();
        console.log("Barrier opening process started.");
      },
      onClosing: () => {
        if(onClosing) onClosing();
        console.log("Barrier is closing...");
      },
      onClosingCompleted: () => {
        setLoading(false);
        if(onCloseCompleted) onCloseCompleted();
        console.log("Barrier has been successfully opened.");
      },
      onClosingError: (error) => {
        setLoading(false);
        if(onCloseFailed) onCloseFailed();
        console.error("Error during barrier operation:", error);
      },
      isAutoClose: true,
      waittingTime: 10, // Wait for 10 seconds before auto-closing
    });
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenBarrier}>
        Đóng barrier
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="blue" />
        <div> Đang đóng barrier...</div>
      </Backdrop>
    </>
  );
};

export default CloseBarrierButton;
