import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/camera_popup.css';
import MQTT from 'paho-mqtt';
import cameraMqttData from '../data/cameraMqttData.json';

const CameraPopup = () => {
  const { camera_name } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [mqttData, setMqttData] = useState(null);

  useEffect(() => {
    const initVal = localStorage.getItem(`${camera_name}_init_val`);
    if (initVal) {
      const { imageUrl, licensePlate } = JSON.parse(initVal);
      setImageUrl(imageUrl);
      setLicensePlate(licensePlate);
    }
  }, [camera_name]);

  useEffect(() => {
    const cameraData = cameraMqttData.find(data => data.name === camera_name);
    if (cameraData) {
      setMqttData(cameraData);
    }
  }, [camera_name]);

  useEffect(() => {
    if (mqttData) {
        const client = new MQTT.Client(mqttData.url, Number(mqttData.port), mqttData.clientId);

        const onConnect = () => {
            console.log('Connected to MQTT broker');
            client.subscribe(mqttData.topic);
        };

        const onMessageArrived = (message) => {
            console.log('Message arrived:', message);
            const payload = JSON.parse(message.payloadString);
            setImageUrl(payload.imageUrl);
            setLicensePlate(payload.licensePlate);
            localStorage.setItem(`${camera_name}_init_val`, JSON.stringify(payload));
        };

        client.onMessageArrived = onMessageArrived;
        client.connect({ onSuccess: onConnect });

        return () => {
            if (client.isConnected()) {
                client.disconnect();
            }
        };
    }
  }, [mqttData]);

  console.log(camera_name);
  return (
    <div className="container-fluid camera-popup">
      <div className="row">
        <div className="col-12">
          <img src={imageUrl} alt={camera_name} className="img-fluid" />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <h2 className="camera-name">{camera_name}</h2>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <h1 className="license-plate">{licensePlate}</h1>
        </div>
      </div>
    </div>
  );
};

export default CameraPopup;
