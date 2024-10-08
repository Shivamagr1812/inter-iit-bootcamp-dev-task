import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLogoutActive, setisLogoutActive] = useState(false);

  return (
    <div className="w-[100%] h-[55px] fixed top-0 flex items-center justify-between bg-[#0d1117] z-[1000]">
      <div className="md:hidden"></div>
      <div className="flex items-center justify-center px-8 md:px-20 text-2xl text-gray-300">
        <p
          className="flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          GPTee
        </p>
      </div>
      <div className="flex items-center px-6 md:px-14 text-gray-300">
        <div className="flex justify-center items-center">
          {isLoggedIn ? (
            <div className="flex flex-col justify-center relative">
              <p
                className="cursor-pointer hover:text-gray-200"
                onClick={() => setisLogoutActive((prev) => !prev)}
              >
                Hi, {user}
              </p>
              <p
                className="absolute top-9 px-3 py-1 rounded-md cursor-pointer bg-red-700 hover:bg-red-800"
                style={
                  isLogoutActive ? { display: "inline" } : { display: "none" }
                }
                onClick={() => navigate("/logout")}
              >
                Logout
              </p>
            </div>
          ) : (
            <button
              className="px-4 py-1 rounded-2xl border border-gray-700 bg-[#131921] hover:bg-[#1e2834] duration-[50ms]"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
