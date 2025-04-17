import React, { useState } from 'react';
import { Button, CircularProgress, Backdrop } from '@mui/material';
import {OpenTruckBarrier, OpenMotoBarrier}from '../BarrierControllers/BarrierController';


const OpenBarrierButton = ({vehicle_type, onStartOpen, onOpening, onOpenCompleted, onOpenFailed }) => {
  const [loading, setLoading] = useState(false);
  const handleOpenBarrier = async () => {
    setLoading(true);
    if(vehicle_type === "MOTO") {
      OpenMotoBarrier({
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
        onOpeningError: (error) => {
          setLoading(false);
          if(onOpenFailed) onOpenFailed();
          console.error("Error during barrier operation:", error);
        },
        isAutoClose: true,
        waittingTime: 10, // Wait for 10 seconds before auto-closing
      });
    }
    if (vehicle_type === "TRUCK") {
      OpenTruckBarrier({
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
        onOpeningError: (error) => {
          setLoading(false);
          if(onOpenFailed) onOpenFailed();
          console.error("Error during barrier operation:", error);
        },
        isAutoClose: true,
        waittingTime: 10, // Wait for 10 seconds before auto-closing
      });
    }
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
