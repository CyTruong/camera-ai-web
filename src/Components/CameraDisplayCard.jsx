import React, {useRef, useEffect} from 'react';
import './css/CameraDisplayCard.css';

const CameraDisplayCard = ({ imageUrl, name, description }) => {
  const streamRef = useRef(null);

  useEffect(() => {
    if (imageUrl && streamRef.current) {
      streamRef.current.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <div className="camera-display-card">
      <div className="image-container">
        <img ref={streamRef} src={imageUrl} alt={name} className="image" />
      </div>
      <div className="info-container">
        <span className="image-name">{name}</span>
        <span className="image-description">{description}</span>
      </div>
    </div>
  );
};

export default CameraDisplayCard;
