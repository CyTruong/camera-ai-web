import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/home_page.css";
import CameraDisplayCard from "../Components/CameraDisplayCard";
import CameraSummaryInfo from "../Components/CameraSummaryInfo";
import cameraDisplayCardsData from "../data/cameraDisplayCards.json";
import MQTT from "paho-mqtt";
import axios from 'axios';

const Home = () => {
  const [cameraDisplayCards, setCameraDisplayCards] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [carsInParking, setCarsInParking] = useState(0);
  const [carsEntering, setCarsEntering] = useState(0);
  const [carsExiting, setCarsExiting] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const loadTransactionData = () => {

    const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
    
    axios.get("http://171.244.16.229:8092/api/transaction/", {
      headers: {
        'Authorization': `Bearer ${token}`,  // Dynamically using the token
      }
    })
    .then(function(response) {
      console.log('Load all trans response', response.data.data);
      const allTransaction = response.data.data;
      let _transaction = [];
      allTransaction.forEach(transaction => {
        const smallLicensePlate = transaction.licensePlateOutSmall?transaction.licensePlateOutSmall:transaction.licensePlateInSmall;
        const fullLicensePlate = transaction.licensePlateOutFull?transaction.licensePlateOutFull:transaction.licensePlateOutFull
        const crop_url = smallLicensePlate;
        const full_url = fullLicensePlate;
        const jsonData = {
          tracker_index : transaction._id,
          license_plate : transaction.licensePlate,
          camera_name : 'MOTOR',
          cropUrl: crop_url, 
          fullUrl: full_url,
          entryTime : transaction.entryTime,
          exitTime : transaction.exitTime,
          parkingTime : transaction.parkingTime
        }
        _transaction.push(jsonData);
      });
      setTransactions(_transaction);
      localStorage.setItem('transaction', JSON.stringify(_transaction));

    })
    .catch(function(err) {
      showLoginForm(true);
    });
  };


  useEffect(() =>{
    // Filter vehicleCaptures based on camera_name
        const enter = transactions.filter(vehicle => vehicle.camera_name === "Camera 1");
        const exit = transactions.filter(vehicle => vehicle.camera_name === "Camera 2");
        console.log('enter',enter)
        console.log('exit',exit)
        if (enter.length > 0) {
       
        }
        
        if (exit.length > 0) {
 
        }
  
        const parking = transactions.filter(vehicle => vehicle.entryTime && !vehicle.exitTime).length;
        console.log('parking',parking)
        setTotalCars(transactions.length);
        setCarsInParking(parking)
        setCarsEntering(transactions.length);
        setCarsExiting(transactions.length - parking);
    },[transactions])
    
  useEffect(() => {
    const motorCaptureMqtt = new MQTT.Client("103.116.8.51", 9001, "");

    motorCaptureMqtt.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker 1");
        motorCaptureMqtt.subscribe(["cameraai/GPG"], (err) => {
          if (err) {
            console.error("Subscription error:", err);
          } else {
            console.log("Subscribed to topics: cameraai/GPG ");
          }
        });
      },
      onFailure: (err) => {
        console.error("Connection failed:", err);
      },
      userName: "gamercial",
      password: "G@m3rc1al",
    });

    motorCaptureMqtt.onMessageArrived = (message) => {
      try {
        const jsonData = JSON.parse(message.payloadString);

        if (jsonData.camera_name === "Camera 1") {
          //Show capture here
        }
        if (jsonData.camera_name === "Camera 2") {
          //Show capture here
        }
        setTimeout(() => {
          loadTransactionData();
        }, "500");
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    };


    return () => {
      motorCaptureMqtt.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(cameraDisplayCardsData);
    loadTransactionData();
    setCameraDisplayCards(cameraDisplayCardsData);
  }, []);

  return (
    <div className="container-fluid home-container">
      <div className="row">
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[0]?.imageUrl || ""}
            name={cameraDisplayCards[0]?.name || ""}
            description={cameraDisplayCards[0]?.description || ""}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[1]?.imageUrl || ""}
            name={cameraDisplayCards[1]?.name || ""}
            description={cameraDisplayCards[1]?.description || ""}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[2]?.imageUrl || ""}
            name={cameraDisplayCards[2]?.name || ""}
            description={cameraDisplayCards[2]?.description || ""}
          />
        </div>
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[3]?.imageUrl || ""}
            name={cameraDisplayCards[3]?.name || ""}
            description={cameraDisplayCards[3]?.description || ""}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[4]?.imageUrl || ""}
            name={cameraDisplayCards[4]?.name || ""}
            description={cameraDisplayCards[4]?.description || ""}
          />
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[5]?.imageUrl || ""}
            name={cameraDisplayCards[5]?.name || ""}
            description={cameraDisplayCards[5]?.description || ""}
          />
        </div>
        <div className="col-4 mb-4">
          <CameraDisplayCard
            imageUrl={cameraDisplayCards[6]?.imageUrl || ""}
            name={cameraDisplayCards[6]?.name || ""}
            description={cameraDisplayCards[6]?.description || ""}
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
