import React, { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext() ;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [logoutTimer, setLogoutTimer] = useState(null);

    useEffect(()=> {
        const token = Cookies.get('token');
        const storedUser = Cookies.get('user');
        const id = Cookies.get('id');

        if( token && storedUser && id ) {
            // Parse the stored user data from cookies
            const userData = JSON.parse(storedUser);
            const _id = JSON.parse(id);
            setUser({ token, ...userData, ..._id});
            // Calculate the remaining time for the token expiration
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // current time in seconds
            if (decodedToken.exp > currentTime) {
              const remainingTime = (decodedToken.exp - currentTime) * 1000; // remaining time in milliseconds

              // Set a timeout to log out the user when the token expires
              const timer = setTimeout(() => {
                logout();
              }, remainingTime);

              setLogoutTimer(timer);
            } else {
              // Token has expired, log the user out
              logout();
            }
        }

    },[]) ;
    
    const backendUrl = 'http://localhost:5000';

    const login = async (email, password) => {
        try {
          const response = await axios.post(`${backendUrl}/login`, { email, password });
          console.log(response);
          const token = response.data.token;
          const userData = { email: response.data.email };
          const id = {id: response.data.id};
          
          // Store the token and user information in cookies
          Cookies.set('token', token);
          Cookies.set('user', JSON.stringify(userData));
          Cookies.set('id',JSON.stringify(id));
          
          return response;
        }
         catch (error) {
          throw new Error(error.response.data.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
          await axios.post(`${backendUrl}/logout`);
          Cookies.remove('token');
          Cookies.remove('user');
          Cookies.remove('id');
          setUser({});
          
          
          if (logoutTimer) {
            clearTimeout(logoutTimer);
            setLogoutTimer(null);
          }
        } catch (error) {
          console.error('Logout failed', error);
        }
    };
    
    console.log(user);
    return (
        <AuthContext.Provider value={{user, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };