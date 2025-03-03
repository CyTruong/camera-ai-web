import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/Home';
import Login from './pages/Login';
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

  console.log(ctx);
  return (
    <>
      {!hideNavBar && <NavigationBar />}
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
