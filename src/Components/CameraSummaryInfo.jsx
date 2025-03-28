import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, ButtonGroup, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import './css/CameraSummaryInfo.css';
import ExcelExportButton from './ExcelExportButton';
import OpenBarrierButton from './OpenBarrierButton';
import CloseBarrierButton from './CloseBarrierButton';

const CameraSummaryInfo = ({ transactions, totalCars, carsInParking, carsEntering, carsExiting }) => {
  const [autoOpen, setAutoOpen] = useState(false);
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const fileName = 'CameraSummary';

  const handleChange = (event, value) => {
    if (value !== null) {
      setAutoOpen(value);
      localStorage.setItem('autoOpenBarier', value);
    }
  };

  useEffect(() => {
    const autoOpenBarrier = localStorage.getItem('autoOpenBarier');
    if (autoOpenBarrier !== null) {
      setAutoOpen(autoOpenBarrier === 'true');
    }
  }, []);
  
  return (
    <div>
      <Card className="camera-summary-info" sx={{ borderRadius: '15px', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h1">{currentDate}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h2">{currentTime}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3">Tổng số xe: {totalCars}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3">Xe trong bãi: {carsInParking}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3">Xe vào: {carsEntering}</Typography>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3">Xe ra: {carsExiting}</Typography>
          </Grid>
        </Grid>
      </Card>
      <Grid container spacing={4} sx={{ marginTop: '16px' }}>
        <Grid item xs={12} md={6}>
          <Card className="functions-pannel" sx={{ borderRadius: '15px', padding: '20px' }}>
            <Typography variant="h5" textAlign="center">Chức năng</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <ExcelExportButton data={transactions} filename={fileName} />
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="barrier-pannel" sx={{ borderRadius: '15px', padding: '20px' }}>
            <Typography variant="h5" textAlign="center">Barrier</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <OpenBarrierButton />
            </Grid>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <CloseBarrierButton />
            </Grid>
            <Typography variant="h6" textAlign="center" sx={{ marginTop: '16px' }}>
              Tự động mở barrier: {autoOpen ? 'Bật' : 'Tắt'}
            </Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <ToggleButtonGroup
                value={autoOpen}
                exclusive
                onChange={handleChange}
                aria-label="auto open toggle"
              >
                <ToggleButton value={false} aria-label="off">
                  Tắt
                </ToggleButton>
                <ToggleButton value={true} aria-label="on">
                  Mở
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CameraSummaryInfo;
