import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/Home';
import Login from './pages/Login';
import Motor from './pages/Motor'; 
import Truck from './pages/Truck'
import { AuthLoginInfo } from './AuthComponents/AuthLogin';
import PrivateRoute from './AuthComponents/PrivateRoute';
import LoginRoute from './AuthComponents/LoginRoute';
import CameraPopup from './pages/CameraPopup';
import NavigationBar from './Components/NavigationBar';

function App() {
  const ctx = useContext(AuthLoginInfo);
  const location = useLocation();
  console.log("location", location);
  const hideNavBar = location.pathname.includes('/camera-popup') || location.pathname.includes('/login');
  const isPin = location.pathname.includes('/moto') || location.pathname.includes('/truck');

  console.log("hideNavBar", hideNavBar);
  console.log("isPin", isPin);
  return (
    <>
      {!hideNavBar && <NavigationBar isPin={isPin} />}
      <div className={hideNavBar ? '' : 'content'}>
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
