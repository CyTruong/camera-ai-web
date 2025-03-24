import React, { useState } from 'react';
import { Button, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';

const OpenBarrierButton = ({ onStartOpen, onOpening, onOpenCompleted, onOpenFailed }) => {
  const [loading, setLoading] = useState(false);

  const handleOpenBarrier = async () => {
    if (onStartOpen) onStartOpen();
    setLoading(true);
    if (onOpening) onOpening();
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      const response = await axios.get('https://www.google.com/');
      if (onOpenCompleted) {
        setLoading(false);
        onOpenCompleted(response);
      }
    } catch (error) {
      setLoading(false);   
      console.error('Failed to open barrier , error:', error);
      if (onOpenFailed) onOpenFailed(error);
    } finally {
      
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenBarrier}>
        Mở barrier
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="blue" />
        <div>Đang mở barrier...</div>
      </Backdrop>
    </>
  );
};

export default OpenBarrierButton;
