import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/CameraSummaryInfo.css';

const CameraSummaryInfo = ({ totalCars, carsInParking, carsEntering, carsExiting }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

const handleExportExcel = () => {
    const cameraName = 'camera1';
    console.log('Navigating to CameraPopup page...');
    window.open(
      `/camera-popup/${cameraName}`,
      '_blank',
      'width=500,height=400,top=100,left=100'
    );
}

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
      <div className="row">
        <div className="col-4 text-center">
          <button type="button" className="btn btn-primary mb-2" onClick={handleExportExcel}>Xuất Excel</button>
        </div>
        <div className="col-4 text-center">
          <button type="button" className="btn btn-secondary mb-2" disabled>Chức năng 2</button>
        </div>
        <div className="col-4 text-center">
          <button type="button" className="btn btn-secondary mb-2" disabled>Chức năng 3</button>
        </div>
      </div>
      <div className="row">
        <div className="col-4 text-center">
         <button type="button" className="btn btn-secondary mb-2" disabled>Chức năng 4</button>
        </div>
        <div className="col-4 text-center">
         <button type="button" className="btn btn-secondary mb-2" disabled>Chức năng 5</button>
        </div>
        <div className="col-4 text-center">
         <button type="button" className="btn btn-secondary mb-2" disabled>Chức năng 6</button>
        </div>
      </div>
    </div>
  );
};

export default CameraSummaryInfo;
