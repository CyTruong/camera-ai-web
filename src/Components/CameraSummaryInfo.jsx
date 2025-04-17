import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import './css/CameraSummaryInfo.css';
import ExcelExportButton from './ExcelExportButton';
import OpenBarrierButton from './OpenBarrierButton';
import CloseBarrierButton from './CloseBarrierButton';

const CameraSummaryInfo = ({ transactions, totalCars, carsInParking, carsEntering, carsExiting }) => {
  const [autoOpen, setAutoOpen] = useState(false);
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const fileName = 'CameraSummary';

  // Function to handle barrier request
  const handleBarrierRequest = async (url) => {
    try {
      console.log("Sending request...");
      await axios.get(url);
    } catch (error) {
      console.error("Error during barrier operation:", error);
    }
  };

  const handleChange = (event, value) => {
    if (value !== null) {
      setAutoOpen(value);
      localStorage.setItem('autoOpenBarier', value.toString());

      // Determine which API endpoint to call based on toggle value
      const url = value
        ? "http://192.168.1.90:3001/disable-barrier"
        : "http://192.168.1.90:3001/active-barrier";

      handleBarrierRequest(url);
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
        <Grid item xs={12} md={4}>
          <Card className="functions-pannel" sx={{ borderRadius: '15px', padding: '20px' }}>
            <Typography variant="h5" textAlign="center">Chức năng</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <ExcelExportButton data={transactions} filename={fileName} buttonTitle={"Xuất Excel xe tải"} />
              <ExcelExportButton data={transactions} filename={fileName} buttonTitle={"Xuất Excel moto"} />
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="barrier-pannel" sx={{ borderRadius: '15px', padding: '10px' }}>
            <Typography variant="h5" textAlign="center">Barrier Xe Tải</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <OpenBarrierButton vehicle_type="TRUCK" />
            </Grid>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <CloseBarrierButton vehicleType="TRUCK" />
            </Grid>
            {/* <Typography variant="h6" textAlign="center" sx={{ marginTop: '16px' }}>
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
            </Grid> */}
          </Card>
          
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="barrier-pannel" sx={{ borderRadius: '15px', padding: '10px' }}>
            <Typography variant="h5" textAlign="center">Barrier Xe Máy</Typography>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <OpenBarrierButton vehicle_type= "MOTO"/>
            </Grid>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <CloseBarrierButton vehicleType= "MOTO" />
            </Grid>
            {/* <Typography variant="h6" textAlign="center" sx={{ marginTop: '16px' }}>
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
            </Grid> */}
          </Card>
          
        </Grid>
      </Grid>
    </div>
  );
};

export default CameraSummaryInfo;
