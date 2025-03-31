import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Register function
    const register = async (username, password) => {
        try {
            const response = await axios.post("/server/auth/register", { username, password });
            return response; // Return the full response to be handled in the frontend
        } catch (error) {
            // Handle error properly and rethrow it for handling in the frontend
            if (error.response && error.response.status === 409) {
                throw new Error('Username already exists');
            } else {
                throw new Error('Registration failed');
            }
        }
    };

    // In AuthContext.js
const login = async (username, password) => {
    try {
        const response = await axios.post("/api/auth/login", { username, password });
        setUser(username); // Make sure userData contains at least the username
        return response; // Return the response to handle it in the frontend if needed
    } catch (error) {
        if (error.response) {
            // If the server responded with a status outside the 2xx range
            throw error.response;
        } else {
            // If the request was made but no response was received
            throw new Error('No Server Response');
        }
    }
};

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        console.log(user);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
