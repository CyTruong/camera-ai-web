import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Home';
import Login from './pages/Login';
import { AuthLoginInfo }  from './AuthComponents/AuthLogin';
import PrivateRoute  from './AuthComponents/PrivateRoute';
import LoginRoute  from './AuthComponents/LoginRoute';



function App() {
    const ctx = useContext(AuthLoginInfo);
    console.log(ctx)
    return (
      <BrowserRouter>
            <Routes>
              <Route path='/' exact element={
                  <PrivateRoute>
                    <Homepage />
                  </PrivateRoute>
                } />
               
              <Route path='/login' element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                } />
              
            </Routes>
      </BrowserRouter>
    );
}

export default App;
