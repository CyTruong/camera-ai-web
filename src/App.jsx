import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/Home';
import Login from './pages/Login';
import Motor from './pages/Motor'; 
import Truck from './pages/Truck';
import SignedVehicle from './pages/SignedVehicle';

import { AuthLoginInfo } from './AuthComponents/AuthLogin';
import PrivateRoute from './AuthComponents/PrivateRoute';
import LoginRoute from './AuthComponents/LoginRoute';
import CameraPopup from './pages/CameraPopup';
import NavigationBar from './Components/NavigationBar';
import { Modal, Box, Typography, Button } from '@mui/material'; // Import MUI components

function App() {
  const ctx = useContext(AuthLoginInfo);
  const location = useLocation();
  const [popupBlocked, setPopupBlocked] = useState(false);

  const checkPopup = () => {
    const popup = window.open("", "test");
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setPopupBlocked(true);
    } else {
      popup.close();
    }
  };

  useEffect(() => {
    checkPopup();
  }, []);

  const openBrowserSettings = () => {
    // Open browser settings page for Chrome, Firefox, and Edge
    if (window.chrome && window.chrome.tabs) {
      // For Chrome
      window.chrome.tabs.create({ url: 'chrome://settings/content/popups' });
    } else if (window.browser && window.browser.tabs) {
      // For Firefox
      window.browser.tabs.create({ url: 'about:preferences#privacy' });
    } else if (window.navigator.userAgent.includes('Edg')) {
      // For Microsoft Edge
      window.open('edge://settings/content/popups', '_blank');
    } else {
      // Fallback for other browsers
      alert("Vui lòng mở cài đặt trình duyệt và cho phép pop-up.");
    }
  };

  const hideNavBar = location.pathname.includes('/camera-popup') || location.pathname.includes('/login');
  const isPin = location.pathname.includes('/moto') || location.pathname.includes('/truck') || location.pathname.includes('/signed-vehicle');

  return (
    <>
      {!hideNavBar && <NavigationBar isPin={isPin} />}
      <div className={hideNavBar ? '' : 'content'}>
        {/* MUI Modal for Popup Warning */}
        <Modal
          open={popupBlocked}
          onClose={() => setPopupBlocked(false)}
          aria-labelledby="popup-warning-title"
          aria-describedby="popup-warning-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: 'center', // Center align text
            }}
          >
            <Typography id="popup-warning-title" variant="h6" component="h2" gutterBottom>
              Cảnh báo Pop-up
            </Typography>
            <Typography id="popup-warning-description" variant="body1" gutterBottom>
              Vui lòng cho phép pop-up trong cài đặt trình duyệt của bạn để tiếp tục.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={openBrowserSettings}
              sx={{ mt: 2, mx: 'auto', display: 'block' }} // Center align button
            >
              Mở Cài đặt Trình duyệt
            </Button>
          </Box>
        </Modal>

        <Routes>
          <Route
            path="/"
            exact
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/moto"
            exact
            element={
              <PrivateRoute>
                <Motor />
              </PrivateRoute>
            }
          />
          <Route 
            path="/truck"
            exact
            element={
              <PrivateRoute>
                <Truck />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            }
          />
          <Route
            path="/signed-vehicle"
            element={
              <PrivateRoute>
                <SignedVehicle />
              </PrivateRoute>
            } 
          />
          <Route
            path="/camera-popup/:camera_name"
            element={
              <CameraPopup />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;