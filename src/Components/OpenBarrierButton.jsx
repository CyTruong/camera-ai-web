import React, { useState } from 'react';
import { Button, CircularProgress, Backdrop } from '@mui/material';
import { OpenBarrier } from '../BarrierControllers/BarrierController';


const OpenBarrierButton = ({ onStartOpen, onOpening, onOpenCompleted, onOpenFailed }) => {
  const [loading, setLoading] = useState(false);
  const handleOpenBarrier = async () => {
    setLoading(true);
    OpenBarrier({
      onStartOpen: () => {
        if(onStartOpen) onStartOpen();
        console.log("Barrier opening process started.");
      },
      onOpening: () => {
        if(onOpening) onOpening();
        console.log("Barrier is opening...");
      },
      onOpenCompleted: () => {
        setLoading(false);
        if(onOpenCompleted) onOpenCompleted();
        console.log("Barrier has been successfully opened.");
      },
      onClosing: () => {
        setLoading(true);
        console.log("Barrier is closing...");
      },
      onClosingCompleted: () => {
        console.log("Barrier has been successfully closed.");
        setLoading(false); // Stop loading after the barrier is closed
      },
      onOpeningError: (error) => {
        setLoading(false);
        if(onOpenFailed) onOpenFailed();
        console.error("Error during barrier operation:", error);
      },
      isAutoClose: true,
      waittingTime: 10, // Wait for 10 seconds before auto-closing
    });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenBarrier}>
        Mở barrier
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="blue" />
        <div> Đang mở barrier...</div>
      </Backdrop>
    </>
  );
};

export default OpenBarrierButton;
