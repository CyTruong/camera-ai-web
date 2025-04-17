import React, { useState } from 'react';
import { Button, CircularProgress, Backdrop } from '@mui/material';
import { CloseMotoBarrier,CloseTruckBarrier } from '../BarrierControllers/BarrierController';


const CloseBarrierButton = ({ vehicleType, onStartClose, onClosing, onCloseCompleted, onCloseFailed }) => {
  const [loading, setLoading] = useState(false);
  const handleOpenBarrier = async () => {
    setLoading(true);
    if (vehicleType === "TRUCK") {
      CloseTruckBarrier({
        onStartClose: () => {
          if (onStartClose) onStartClose();
          console.log("Barrier closing process started.");
        },
        onClosing: () => {
          if (onClosing) onClosing();
          console.log("Barrier is closing...");
        },
        onCloseCompleted: () => {
          setLoading(false);
          if (onCloseCompleted) onCloseCompleted();
          console.log("Barrier has been successfully closed.");
        },
        onClosingError: (error) => {
          setLoading(false);
          if (onCloseFailed) onCloseFailed();
          console.error("Error during barrier operation:", error);
        },
      });
    }
    if (vehicleType === "MOTO") {
      CloseMotoBarrier({
        onStartClose: () => {
          if (onStartClose) onStartClose();
          console.log("Barrier closing process started.");
        },
        onClosing: () => {
          if (onClosing) onClosing();
          console.log("Barrier is closing...");
        },
        onCloseCompleted: () => {
          setLoading(false);
          if (onCloseCompleted) onCloseCompleted();
          console.log("Barrier has been successfully closed.");
        },
        onClosingError: (error) => {
          setLoading(false);
          if (onCloseFailed) onCloseFailed();
          console.error("Error during barrier operation:", error);
        },
      });
    }
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
