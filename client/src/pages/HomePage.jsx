import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ConversationSection from "../components/ConversationSection";
import InputField from "../components/InputField";
import { useAuth } from "../context/LoginState";

function Home() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { isLoggedIn } = useAuth();

  const [conversation_data, setConversation_data] = useState([
    {
      role: "ai",
      content: "How may I help you today ?",
    },
  ]);

  // Function to add 'msg' to 'conversation_data'
  function addConversation(msg) {
    let temp = [];
    // If user has given some prompt with/without file
    console.log(msg);
    if (msg.content.length > 0) {
      temp = [...conversation_data, msg];
      setConversation_data(temp);
    }
    // If user only uploaded file without prompt
    else if (msg.file) {
      temp = [
        ...conversation_data,
        { ...msg, content: "Getting response for uploaded file" },
      ];
      setConversation_data(temp);
    }
  }

  // To get backend response
  useEffect(() => {
    if (
      (conversation_data[conversation_data.length - 1].content ||
        conversation_data[conversation_data.length - 1].file) &&
      conversation_data[conversation_data.length - 1].role === "user"
    ) {
      const msg = conversation_data[conversation_data.length - 1];

      // Function to get response from a prompt
      async function getResponse(prompt) {
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: "POST",
          body: JSON.stringify({
            prompt: prompt,
            sessionToken: sessionStorage.getItem("sessionToken"),
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const result = await response.json();
        const convo = await result.response;

        const temp = {
          role: "ai",
          content: convo,
        };
        addConversation(temp);
      }
      // Function to get response if file included with request
      async function getResponseWithFile(msg) {
        const formData = new FormData();
        formData.append("file", msg.file);
        formData.append("prompt", msg.content);

        try {
          // Send the form data to backend
          const response = await fetch(`${BACKEND_URL}/chat/file`, {
            method: "POST",
            body: formData,
          });

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
  }, [conversation_data]);

  return (
    <div className="w-[100%] h-screen flex flex-col">
      <Navbar />
      <ConversationSection conversation_data={conversation_data} />
      <InputField addConversation={addConversation} />
    </div>
  );
}

export default Home;
