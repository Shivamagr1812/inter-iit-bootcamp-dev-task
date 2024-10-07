import React from 'react';
import { Routes, Navigate } from 'react-router-dom';

// ProtectedRoute component that checks for token
const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log(token);

    if(token){
        console.log(children);
        return children;
    }
    else{
        <Navigate to="/login"/>
    }

};

export default ProtectedRoute;
