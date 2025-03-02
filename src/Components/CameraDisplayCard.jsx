import React from 'react';
import './css/CameraDisplayCard.css';

const CameraDisplayCard = ({ imageUrl, name, description }) => {
  return (
    <div className="camera-display-card">
      <div className="image-container">
        <img src={imageUrl} alt={name} className="image" />
      </div>
      <div className="info-container">
        <span className="image-name">{name}</span>
        <span className="image-description">{description}</span>
      </div>
    </div>
  );
};

export default CameraDisplayCard;
