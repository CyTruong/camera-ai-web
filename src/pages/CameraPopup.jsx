import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Checkbox, 
  Card,
  CardMedia,
  FormControl,
  FormLabel
} from "@mui/material";
import cameraMqttData from "../data/cameraMqttData.json";
import "./css/camera_popup.css";
import CloseBarrierButton from "../Components/CloseBarrierButton";
import OpenBarrierButton from "../Components/OpenBarrierButton";


const CameraPopup = () => {
  const { camera_name } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [mqttData, setMqttData] = useState(null);
  const [barrierStatus, setBarrierStatus] = useState("Chưa mở barrier");
  const [waitingBarrier, setWaitingBarrier] = useState(false);
  const autoOpenBarrier = localStorage.getItem("autoOpenBarier") === "true";
  const [autoClose, setAutoClose] = useState(localStorage.getItem("autoClose") === "true");
  const [countdown, setCountdown] = useState(10);

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
    console.log("initVal cameraname ", `${camera_name}_init_val`);
    localStorage.removeItem(`${camera_name}_init_val`);
  }, [camera_name]);

  // Tìm dữ liệu MQTT tương ứng với camera_name
  useEffect(() => {
    const cameraData = cameraMqttData.find((data) => data.name === camera_name);
    if (cameraData) {
      setMqttData(cameraData);
    }
  }, [camera_name]);


  useEffect(() => {
    // Make sure popup stays focused when opened
    window.focus();
    
    // Optional: Prevent the popup from being closed accidentally
    window.onbeforeunload = (e) => {
      e.preventDefault();
      return "Are you sure you want to close the camera view?";
    };
    
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    let timer;
    if (autoClose) {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            window.close();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [autoClose]);

  const handleAutoCloseChange = (e) => {
    const isChecked = e.target.checked;
    setAutoClose(isChecked);
    localStorage.setItem("autoClose", isChecked ? "true" : "false");
  };

  const handleOpening = () => {
    setBarrierStatus("Barrier đang mở");
  };

  const handleOpenCompleted = () => {
    setBarrierStatus("Barrier đã mở");
  };

  const handleOpenFailed = () => {
    setBarrierStatus("Mở barrier thất bại");
  };

  const handleClosing = () => {
    setBarrierStatus("Barrier đang mở");
  };

  const handleCloseCompleted = () => {
    setBarrierStatus("Barrier đã mở");
  };

  const handleCloseFailed = () => {
    setBarrierStatus("Mở barrier thất bại");
  };

  const getStatusClass = () => {
    if (barrierStatus.includes("đang")) return "opening";
    if (barrierStatus.includes("đã")) return "opened";
    if (barrierStatus.includes("thất bại")) return "failed";
    return "";
  };

  return (
    <Container className="camera-popup-container" maxWidth="lg">
      <Box className="popup-content-container">
        <Card className="image-card">
          <CardMedia
            component="img"
            image={imageUrl}
            alt={camera_name}
            sx={{ width: '100%', height: 'auto', maxHeight: 800 , objectFit: 'contain'}}
          />
        </Card>

        <Card className="info-card">
          <Typography variant="h5" className="camera-name">
            {mqttData?.displayName}
          </Typography>

          <Box className="license-plate-box">
            <Typography variant="h2" className="license-plate">
              {licensePlate}
            </Typography>
          </Box>

          <Typography variant="h4" className={`barrier-status-text ${getStatusClass()}`}>
            {barrierStatus}
          </Typography>
          <Card sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6"   sx={{ textAlign: 'center' }}>
              Barrier xe Container
            </Typography>
            <OpenBarrierButton 
              vehicleType="TRUCK"
              onOpening={handleOpening} 
              onOpenCompleted={handleOpenCompleted} 
              onOpenFailed={handleOpenFailed}
              sx={{ mt: 4 }}
            />

            <CloseBarrierButton
              vehicleType="TRUCK"
              onClosing={handleClosing} 
              onCloseCompleted={handleCloseCompleted} 
              onCloseFailed={handleCloseFailed}
              sx={{ mt: 4 }}
            />
          </Card>
          <Card sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6"   sx={{ textAlign: 'center' }}>
              Barrier xe máy
            </Typography>
            <OpenBarrierButton 
              vehicleType="MOTO"
              onOpening={handleOpening} 
              onOpenCompleted={handleOpenCompleted} 
              onOpenFailed={handleOpenFailed}
              sx={{ mt: 4 }}
            />

            <CloseBarrierButton
              vehicleType="MOTO"
              onClosing={handleClosing} 
              onCloseCompleted={handleCloseCompleted} 
              onCloseFailed={handleCloseFailed}
              sx={{ mt: 4 }}
            />
          </Card>
        

          {waitingBarrier && (
            <CircularProgress color="inherit" sx={{ mt: 4 }} />
          )}
        </Card>
      </Box>

      <Box >
        <FormControl className="checkbox-container">
          <Checkbox
            checked={autoClose}
            onChange={handleAutoCloseChange}
            color="primary"
          />
          <FormLabel id="count-down-text-id" style={{width : "200px"}}>
            {autoClose ? `Tự động đóng sau ${countdown}s` : `Tự động đóng sau ${countdown}s`}
          </FormLabel>
        </FormControl>
      </Box>
    </Container>
  );
};

export default CameraPopup;