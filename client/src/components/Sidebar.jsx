import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/LoginState";
import { RiEdgeNewLine } from "react-icons/ri";
import { RiMenu2Line } from "react-icons/ri";

function Sidebar({ chatHistory }) {
  const { isLoggedIn } = useAuth();
  const navWidth = {
    max: "280px",
    min: "65px",
  };
  const [navOpen, setNavOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Function to handle click outside of the navbar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setNavOpen(false);
    }
  };

  // Add event listener for detecting clicks outside the navbar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="min- h-screen fixed top-0 duration-[450ms] bg-gray-800 text-gray-300 text-2xl font-poppins 
      z-50"
      style={{ width: navOpen ? navWidth.max : navWidth.min }}
      ref={sidebarRef}
    >
      <div
        className="h-full flex flex-col"
        style={
          navOpen
            ? { backgroundColor: "#1f2937" }
            : { backgroundColor: "#131921" }
        }
      >
        <div className="flex gap- 2 bg-[#0d1117] w-full py-2.8 h-[55px] text-4xl items-center justify-center cursor-pointer">
          {navOpen ? (
            <div>
              <RiEdgeNewLine />
            </div>
          ) : (
            <div className="text-2xl" onClick={() => setNavOpen(true)}>
              <RiMenu2Line />
            </div>
          )}
          <p
            className="text-2xl font-sans font-semibold"
            style={
              navOpen
                ? { scale: "1", position: "relative" }
                : { scale: "0", position: "absolute" }
            }
          >
            GPTee
          </p>
        </div>
        {navOpen ? (
          <div className="duration-[450ms]">
            <div className="border-b border-white">
              <p className="px-4 py-3">Chat History</p>
            </div>
            <div className="max-h-[84%]  px-4 pt-4 text-[1.1rem] flex gap-4 flex-col overflow-auto">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500">Chat history will be shown here</p>
              ) : (
                chatHistory.map((chat, index) => {
                  return (
                    <div key={index} className="">
                      {chat.length > 30 ? (
                        <p>{chat.substring(0, 25) + "..."}</p>
                      ) : (
                        <p>{chat}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
