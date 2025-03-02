import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/home_page.css';
import CameraDisplayCard from '../Components/CameraDisplayCard';
import CameraSummaryInfo from '../Components/CameraSummaryInfo';
import cameraDisplayCardsData from '../data/cameraDisplayCards.json';

const Home = () => {
  const [cameraDisplayCards, setCameraDisplayCards] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [carsInParking, setCarsInParking] = useState(0);
  const [carsEntering, setCarsEntering] = useState(0);
  const [carsExiting, setCarsExiting] = useState(0);

  useEffect(() => {
    console.log(cameraDisplayCardsData);
    setCameraDisplayCards(cameraDisplayCardsData);
  }, []);

  return (
    <div className="container-fluid home-container">
      <div className="row">
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[0]?.imageUrl || ''}
            name={cameraDisplayCards[0]?.name || ''}
            description={cameraDisplayCards[0]?.description || ''}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[1]?.imageUrl || ''}
            name={cameraDisplayCards[1]?.name || ''}
            description={cameraDisplayCards[1]?.description || ''}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[2]?.imageUrl || ''}
            name={cameraDisplayCards[2]?.name || ''}
            description={cameraDisplayCards[2]?.description || ''}
          />
        </div>
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[3]?.imageUrl || ''}
            name={cameraDisplayCards[3]?.name || ''}
            description={cameraDisplayCards[3]?.description || ''}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[4]?.imageUrl || ''}
            name={cameraDisplayCards[4]?.name || ''}
            description={cameraDisplayCards[4]?.description || ''}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[5]?.imageUrl || ''}
            name={cameraDisplayCards[5]?.name || ''}
            description={cameraDisplayCards[5]?.description || ''}
          />
        </div>
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[6]?.imageUrl || ''}
            name={cameraDisplayCards[6]?.name || ''}
            description={cameraDisplayCards[6]?.description || ''}
          />
          <div className="custom-card double-height mt-4">
            <div className="card-body">
              <CameraSummaryInfo
                totalCars={totalCars}
                carsInParking={carsInParking}
                carsEntering={carsEntering}
                carsExiting={carsExiting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
