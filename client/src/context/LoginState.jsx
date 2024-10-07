import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// create a context
const AuthContext = createContext();

// create provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  //   login function
  const login = (userData) => {
    setIsLoggedIn(true);

    if (userData) {
      const newSessionToken = uuidv4();

      sessionStorage.setItem("sessionToken", newSessionToken);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // logout function
  const logout = () => {
    setIsLoggedIn(false);

    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("sessionToken");
  };

  // check if user already logged in when page loads
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));

      // Check for already existing sessionToken
      const sessionToken = sessionStorage.getItem("sessionToken");

      // No sessionToken found - generate new
      if (!sessionToken) {
        const newSessionToken = uuidv4();

        sessionStorage.setItem("sessionToken", newSessionToken);
        console.log("sessionToken generated successfully");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
