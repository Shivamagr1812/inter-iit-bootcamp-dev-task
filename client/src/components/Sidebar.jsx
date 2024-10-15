import React, { useState, useRef, useEffect } from "react";
import { RiEdgeNewLine } from "react-icons/ri";
import { RiMenu2Line } from "react-icons/ri";

function Sidebar({ setConversationData }) {
  const [chatHistory, setChatHistory] = useState([]);
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

  const handleSetConversation = (index) => {
    setConversationData(chatHistory[index]);
  };

  // Fetch chat history
  useEffect(() => {
    const getChatHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/chatHistory`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const result = await response.json();
        const temp = [];

        result.forEach((chat) => {
          const message = chat.messages;
          temp.push(message);
        });

        setChatHistory(temp.reverse());
        console.log(temp);
      } catch (err) {
        console.log("Network Error in fetching chatHistory");
      }
    };

    getChatHistory();
  }, []);

  return (
    <div
      className="h-screen fixed top-0 bg-gray-800 text-gray-300 text-2xl font-poppins 
      z-[2000]"
      style={{
        width: navOpen ? navWidth.max : navWidth.min,
        height: navOpen ? "100%" : "55px",
      }}
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
        <div className="h-[55px] w-full flex gap-2 py-2.8 text-4xl items-center justify-center cursor-pointer bg-[#0d1117]">
          {navOpen ? (
            <div>
              <RiEdgeNewLine className="text-3xl" />
            </div>
          ) : (
            <div className="text-2xl" onClick={() => setNavOpen(true)}>
              <RiMenu2Line />
            </div>
          )}
          <p
            className="text-2xl font-sans"
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
          <div>
            <div className="border-b border-gray-500">
              <p className="px-4 py-3">Chat History</p>
            </div>
            <div className="max-h-[84%] px-2 pt-4 text-[1.1rem] flex gap-4 flex-col overflow-auto">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500">Chat history will be shown here</p>
              ) : (
                chatHistory.map((chat, index) => {
                  return (
                    <div
                      key={index}
                      className="hover:bg-gray-900 duration-75 cursor-pointer px-2 py-1 rounded-md"
                      onClick={() => handleSetConversation(index)}
                    >
                      {chat[0].content.length > 25 ? (
                        <p>{chat[0].content.substring(0, 25) + "..."}</p>
                      ) : (
                        <p>{chat[0].content}</p>
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
