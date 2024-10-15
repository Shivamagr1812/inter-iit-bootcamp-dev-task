import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// Import components
import Navbar from "../components/Navbar";
import ConversationSection from "../components/ConversationSection";
import InputField from "../components/InputField";
import Sidebar from "../components/Sidebar";

function Home() {
  const { isLoggedIn } = useAuth();

  const [conversation, setConversation] = useState([
    {
      role: "ai",
      content: "How may I help you today ?",
    },
  ]);

  // Function to add 'msg' to 'conversation'
  function addConversation(msg) {
    let temp = [];
    // If user has given some prompt with/without file
    if (msg.content.length > 0) {
      temp = [...conversation, msg];
      setConversation(temp);
    }
    // If user only uploaded file without prompt
    else if (msg.file) {
      temp = [
        ...conversation,
        { ...msg, content: "Getting response for uploaded file" },
      ];
      setConversation(temp);
    }
  }
  // Function to set conversation
  function setConversationData(convo) {
    setConversation(convo);
  }

  // To get backend response
  useEffect(() => {
    const msg = conversation[conversation.length - 1];

    if ((msg.content || msg.file) && msg.role === "user") {
      // Function to get response from a prompt
      async function getResponse(prompt) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/chat`,
            {
              method: "POST",
              body: JSON.stringify({
                prompt: prompt,
                sessionToken: sessionStorage.getItem("sessionToken"),
              }),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          if (response.ok) {
            const result = await response.json();
            const convo = await result.response;

            const temp = {
              role: "ai",
              content: convo,
            };

            addConversation(temp);
          } else {
            console.log("Propmt sending failed");
          }
        } catch (err) {
          console.log("Network Error");
        }
      }
      // Function to get response if file included with request
      async function getResponseWithFile(msg) {
        const formData = new FormData();
        formData.append("file", msg.file);
        formData.append("prompt", msg.content);
        formData.append("sessionToken", sessionStorage.getItem("sessionToken"));

        try {
          // Send the form data to backend
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/chat/file`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (response.ok) {
            console.log("File uploaded successfully:");
            const result = await response.json();

            const convo = await result.response;

            const temp = {
              role: "ai",
              content: convo,
            };
            addConversation(temp);
          } else {
            console.log("File upload failed");
          }
        } catch (error) {
          console.log("Error uploading file:", error);
        }
      }

      if (msg.file) {
        getResponseWithFile(msg);
      } else {
        getResponse(msg.content);
      }
    }
  }, [conversation]);

  return (
    <div className="w-[100%] h-screen flex flex-col">
      {isLoggedIn ? (
        <Sidebar setConversationData={setConversationData} />
      ) : null}
      <Navbar />
      <ConversationSection conversation={conversation} />
      <InputField addConversation={addConversation} />
    </div>
  );
}

export default Home;
