import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Typography, Box } from "@mui/material";
import MQTT from "paho-mqtt";
import cameraMqttData from "../data/cameraMqttData.json";
import "./css/camera_popup.css";

const CameraPopup = () => {
  const { camera_name } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [mqttData, setMqttData] = useState(null);

  // Hàm chuyển đổi đường dẫn ảnh thành URL
  const convertToUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") {
      return "http://115.73.209.76:8092/placeholder.png";
    }
    const baseUrl = "http://171.244.16.229:8070/";
    const filename = imagePath.split("/")[0];
    return `${baseUrl}/${filename}`;
  };

  // Khởi tạo giá trị ban đầu từ localStorage
  useEffect(() => {
    const initVal = localStorage.getItem(`${camera_name}_init_val`);
    if (initVal) {
      const { full_path, license_plate } = JSON.parse(initVal);
      setImageUrl(convertToUrl(full_path));
      setLicensePlate(license_plate);
    }
  }, [camera_name]);

  // Tìm dữ liệu MQTT tương ứng với camera_name
  useEffect(() => {
    const cameraData = cameraMqttData.find((data) => data.name === camera_name);
    if (cameraData) {
      setMqttData(cameraData);
    }
  }, [camera_name]);

  // Kết nối MQTT và lắng nghe tin nhắn
  useEffect(() => {
    if (mqttData) {
      const client = new MQTT.Client(mqttData.url, Number(mqttData.port), mqttData.clientId || "");

      client.connect({
        onSuccess: () => {
          console.log("Connected to MQTT broker");
          client.subscribe([mqttData.topic], (err) => {
            if (err) {
              console.error("Subscription error:", err);
            } else {
              console.log("Subscribed to topics: " + mqttData.topic);
            }
          });
        },
        onFailure: (err) => {
          console.error("Connection failed:", err);
        },
        userName: "gamercial",
        password: "G@m3rc1al",
      });

      client.onMessageArrived = (message) => {
        const payload = JSON.parse(message.payloadString);
        setImageUrl(convertToUrl(payload.full_path));
        setLicensePlate(payload.license_plate);
        localStorage.setItem(`${camera_name}_init_val`, JSON.stringify(payload));
      };

      const handleBeforeUnload = (event) => {
        localStorage.removeItem(`${camera_name}_init_val`);
      };

      const handleUnload = () => {
        client.disconnect();
        console.log("Disconnected from MQTT broker");
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('unload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleUnload);
        client.disconnect();
      };
    }
  }, [mqttData]);

  return (
    <Container className="camera-popup" maxWidth="md">
      {/* Hình ảnh */}
      <Box className="image-container">
        <img src={imageUrl} alt={camera_name} className="img-fluid" style={{ width: '100%', maxHeight: '500px' }} />
      </Box>

      {/* Tên camera */}
      <Typography variant="h5" className="camera-name mt-3">
        {mqttData?.displayName}
      </Typography>

      {/* Biển số xe */}
      <Box className="license-plate-container mt-3">
        <Typography variant="h2" className="license-plate">
          {licensePlate}
        </Typography>
      </Box>
    </Container>
  );
};

export default CameraPopup;