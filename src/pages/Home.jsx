import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import CameraDisplayCard from "../Components/CameraDisplayCard";
import CameraSummaryInfo from "../Components/CameraSummaryInfo";
import cameraDisplayCardsData from "../data/cameraDisplayCards.json";
import MQTT from "paho-mqtt";
import axios from "axios";
import "./css/home_page.css"; // Import the CSS file

const Home = () => {
  const [cameraDisplayCards, setCameraDisplayCards] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [carsInParking, setCarsInParking] = useState(0);
  const [carsEntering, setCarsEntering] = useState(0);
  const [carsExiting, setCarsExiting] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const loadTransactionData = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://171.244.16.229:8092/api/transaction/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Load all trans response", response.data.data);
        const allTransaction = response.data.data;
        const _transaction = allTransaction.map((transaction) => ({
          tracker_index: transaction._id,
          license_plate: transaction.licensePlate,
          camera_name: "MOTOR",
          cropUrl: transaction.licensePlateOutSmall || transaction.licensePlateInSmall,
          fullUrl: transaction.licensePlateOutFull || transaction.licensePlateInFull,
          entryTime: transaction.entryTime,
          exitTime: transaction.exitTime,
          parkingTime: transaction.parkingTime,
        }));
        setTransactions(_transaction);
        localStorage.setItem("transaction", JSON.stringify(_transaction));
      })
      .catch((err) => {
        console.error("Error loading transactions:", err);
      });
  };

  useEffect(() => {
    const enter = transactions.filter((vehicle) => vehicle.camera_name === "Camera 1");
    const exit = transactions.filter((vehicle) => vehicle.camera_name === "Camera 2");
    const parking = transactions.filter((vehicle) => vehicle.entryTime && !vehicle.exitTime).length;

    setTotalCars(transactions.length);
    setCarsInParking(parking);
    setCarsEntering(transactions.length);
    setCarsExiting(transactions.length - parking);
  }, [transactions]);

  useEffect(() => {
    const motorCaptureMqtt = new MQTT.Client("103.116.8.51", 9001, "");

    motorCaptureMqtt.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker 1");
        motorCaptureMqtt.subscribe(["cameraai/GPG"], (err) => {
          if (err) {
            console.error("Subscription error:", err);
          } else {
            console.log("Subscribed to topics: cameraai/GPG");
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
        if (jsonData.camera_name === "Camera 1" || jsonData.camera_name === "Camera 2") {
          setTimeout(() => {
            loadTransactionData();
          }, 500);
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    };

    return () => {
      motorCaptureMqtt.disconnect();
    };
  }, []);

  useEffect(() => {
    setCameraDisplayCards(cameraDisplayCardsData);
    loadTransactionData();
  }, []);

  return (
    <Container fluid className="home-container">
      <Row className="g-4">
        {/* First Column */}
        <Col md={4}>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[0]?.imageUrl || ""}
              name={cameraDisplayCards[0]?.name || ""}
              description={cameraDisplayCards[0]?.description || ""}
            />
          </Card>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[1]?.imageUrl || ""}
              name={cameraDisplayCards[1]?.name || ""}
              description={cameraDisplayCards[1]?.description || ""}
            />
          </Card>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[2]?.imageUrl || ""}
              name={cameraDisplayCards[2]?.name || ""}
              description={cameraDisplayCards[2]?.description || ""}
            />
          </Card>
        </Col>

        {/* Second Column */}
        <Col md={4}>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[3]?.imageUrl || ""}
              name={cameraDisplayCards[3]?.name || ""}
              description={cameraDisplayCards[3]?.description || ""}
            />
          </Card>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[4]?.imageUrl || ""}
              name={cameraDisplayCards[4]?.name || ""}
              description={cameraDisplayCards[4]?.description || ""}
            />
          </Card>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[5]?.imageUrl || ""}
              name={cameraDisplayCards[5]?.name || ""}
              description={cameraDisplayCards[5]?.description || ""}
            />
          </Card>
        </Col>

        {/* Third Column */}
        <Col md={4}>
          <Card className="styled-card mb-4">
            <CameraDisplayCard
              imageUrl={cameraDisplayCards[6]?.imageUrl || ""}
              name={cameraDisplayCards[6]?.name || ""}
              description={cameraDisplayCards[6]?.description || ""}
            />
          </Card>
          <Card className="styled-card double-height mt-4">
            <Card.Body>
              <CameraSummaryInfo
                totalCars={totalCars}
                carsInParking={carsInParking}
                carsEntering={carsEntering}
                carsExiting={carsExiting}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;