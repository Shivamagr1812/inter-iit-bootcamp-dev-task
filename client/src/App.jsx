import Navbar from "./components/Navbar";
import ConversationSection from "./components/ConversationSection";
import InputField from "./components/InputField";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [conversation_data, setConversation_data] = useState([
    {
      role: "ai",
      content: "How may I help you today ?",
    },
  ]);
  const BACKEND_URL = "http://localhost:5000/chat";

  function addConversation(msg) {
    const temp = [...conversation_data, msg];

    setConversation_data(temp);
  }

  useEffect(() => {
    // Condition pending for only user
    if (
      conversation_data.length != 0 &&
      conversation_data[conversation_data.length - 1].role === "user" &&
      conversation_data[conversation_data.length - 1].content
    ) {
      const msg = conversation_data[conversation_data.length - 1];

      async function getResponse(prompt) {
        const response = await fetch(BACKEND_URL, {
          method: "POST",
          body: JSON.stringify({ prompt: prompt }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        const convo = await data.response;
        console.log(convo);

        const temp = {
          role: "ai",
          content: convo,
        };
        addConversation(temp);
      }

      getResponse(msg.content);
    }
  }, [conversation_data]);

  return (
    <div className="w-[100%] min-h-[100vh] flex flex-col">
      <Navbar />
      <ConversationSection conversation_data={conversation_data} />
      <InputField addConversation={addConversation} />
    </div>
  );
}

export default App;
