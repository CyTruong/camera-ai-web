import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/CameraSummaryInfo.css';
import ExcelExportButton from './ExcelExportButton';

const CameraSummaryInfo = ({ transactions, totalCars, carsInParking, carsEntering, carsExiting }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const header = {
    tracker_index: 'Tracker Index',
    license_plate: 'License Plate',
    camera_name: 'Camera Name',
    cropUrl: 'Crop URL',
    fullUrl: 'Full URL',
    entryTime: 'Entry Time',
    exitTime: 'Exit Time',
    parkingTime: 'Parking Time'
  };

  const fileName = 'CameraSummary';
  const sheetOptions = { skipHeader: false };

  return (
    <div className="camera-summary-info container-fluid">
      <div className="row mb-3">
        <div className="col text-center">
          <h1>{currentDate}</h1>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-center">
          <h2>{currentTime}</h2>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-center">
          <h3>Tổng số xe: {totalCars}</h3>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-center">
          <h3>Xe trong bãi: {carsInParking}</h3>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-center">
          <h3>Xe vào: {carsEntering}</h3>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col text-center">
          <h3>Xe ra: {carsExiting}</h3>
        </div>
      </div>
      <div className="col-4 text-center">
        <ExcelExportButton data={transactions} header={header} fileName={fileName} sheetOptions={sheetOptions} />
      </div>
    </div>
  );
};

export default CameraSummaryInfo;
