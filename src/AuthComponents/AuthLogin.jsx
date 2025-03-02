import React, { createContext, useEffect, useState} from 'react';
import axios from 'axios';


export const AuthLoginInfo = createContext({});
export function AuthLogin(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthLoginInfo token ', token);
    if (!token) {
      setUser(null);
    } else {
      setUser(token)
    }
  }, []);

  return (
    <AuthLoginInfo.Provider value={user}>{props.children}</AuthLoginInfo.Provider>
  );
}
