import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./App.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for code blocks

function App() {
  const [currentView, setCurrentView] = useState("login"); // To track current view (login, register, chat)
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]); // Chat history
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false); // State to track if Assistant is typing
  const [isListening, setIsListening] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false); // Checkbox state for text-to-speech
  const [copiedIndex, setCopiedIndex] = useState(-1); // Track which code block was copied
  const [typingIntervalId, setTypingIntervalId] = useState(null); // To track typing interval
  const chatEndRef = useRef(null);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://laplacechatbot.onrender.com";

  // Check for token in cookies when the app first loads
  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUserId = Cookies.get("userId");
    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
      setCurrentView("chat");
    }
  }, []);

  // Automatically scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Fetch chat history when token and userId are set
  useEffect(() => {
    if (token && userId) {
      fetchChatHistory();
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/chat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.history) {
        const formattedHistory = response.data.history.map((msg) => ({
          role: msg.role,
          content: msg.message,
        }));
        setConversation(formattedHistory); // Set the chat history in conversation state
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError("Failed to load chat history.");
    }
  };

  // Function to submit a question
  const askQuestion = async () => {
    if (!question.trim() || !token) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("message", question);
      formData.append("userId", userId);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Fetch the full response from the backend
      const response = await axios.post(`${backendUrl}/chat`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Add the user's message to the conversation
      setConversation((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "..." }, // Placeholder for AI response
      ]);

      // Call function to display the response character by character
      const aiResponse = response.data.response;
      setIsTyping(true); // Show typing indicator
      displayTypingEffect(aiResponse);

      setQuestion("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  // Function to display typing effect (character by character)
  const displayTypingEffect = (response) => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < response.length) {
        const nextCharacter = response[currentIndex];

        // Update the last message in the conversation (AI's response)
        setConversation((prev) => {
          const updatedConversation = [...prev];
          const lastMessage =
            updatedConversation[updatedConversation.length - 1];
          updatedConversation[updatedConversation.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + nextCharacter, // Append next character
          };
          return updatedConversation;
        });

        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        currentIndex++;
      } else {
        clearInterval(intervalId); // Stop the interval when done
        setIsTyping(false); // Remove typing indicator

        // If text-to-speech is enabled, read out the response
        if (textToSpeechEnabled) {
          textToSpeech(response);
        }
      }
    }, 10); // Adjust typing speed as needed

    setTypingIntervalId(intervalId); // Save interval id to stop later
  };

  // Function to stop AI response mid-way
  const stopTyping = () => {
    if (typingIntervalId) {
      clearInterval(typingIntervalId); // Stop the typing interval
      setIsTyping(false); // Reset typing state
    }
  };

  // Text-to-speech function to convert AI response into voice
  const textToSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Set language to English
    window.speechSynthesis.speak(speech);
  };

  // Speech-to-text function to listen to user's voice input and convert it to text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition API is not supported in this browser. Please use Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuestion(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Speech recognition error.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  // Function to detect code blocks, bold, and italic text, and format them with a copy button
  const renderMessageContent = (message, msgIndex) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const boldRegex = /\*\*(.*?)\*\*/g; // Matches **bold**
    const italicRegex = /\*(.*?)\*/g;    // Matches *italic*

    const matches = [...message.matchAll(codeBlockRegex)];

    if (matches.length === 0) {
      // Replace bold and italic markers with actual HTML elements
      let formattedMessage = message
        .replace(boldRegex, "<strong>$1</strong>")   // Replace **text** with <strong>text</strong>
        .replace(italicRegex, "<em>$1</em>");        // Replace *text* with <em>text</em>
    
      // Return the message with the formatting
      return <span dangerouslySetInnerHTML={{ __html: formattedMessage }}></span>;
    }

    const formattedMessage = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      const [fullMatch, language, code] = match;
      const beforeText = message.slice(lastIndex, match.index);

      formattedMessage.push(
        <span key={`text-${index}`}>{beforeText}</span>
      );

      formattedMessage.push(
        <div key={`code-${index}`} className="code-block">
          <div className="code-header">
            <span>{language || "plaintext"}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopiedIndex(msgIndex); // Set copied state to the message index
                setTimeout(() => setCopiedIndex(-1), 2000); // Reset copied state after 2 seconds
              }}
            >
              {copiedIndex === msgIndex ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <SyntaxHighlighter
            language={language || "plaintext"}
            style={materialDark}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
      lastIndex = match.index + fullMatch.length;
    });

    formattedMessage.push(
      <span key="last-text">{message.slice(lastIndex)}</span>
    );

    return formattedMessage;
  };

  // Handle "Enter" key press to submit question
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default "new line" behavior
      askQuestion(); // Call askQuestion function
    }
  };

  // Login handler
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${backendUrl}/login`, {
        username,
        password,
      });
      setToken(response.data.token);
      setUserId(response.data.userId);

      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("userId", response.data.userId, { expires: 7 });
      setCurrentView("chat");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please check your credentials."
      ); // Display error message from backend if present
    }
  };

  // Register handler
  const handleRegister = async (username, password) => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${backendUrl}/register`, { username, password });

      alert("Registration successful! Please login.");
      setCurrentView("login"); // Redirect to login after registration
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      ); // Display error message from backend if present
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");

    setToken(null);
    setUserId(null);
    setCurrentView("login");
  };

  return (
    <div className="container">
      {currentView === "login" && (
        <Login onLogin={handleLogin} setCurrentView={setCurrentView} error={error} />
      )}
      {currentView === "register" && (
        <Register onRegister={handleRegister} setCurrentView={setCurrentView} error={error} />
      )}
      {currentView === "chat" && token && (
        <>
          <div className="chat-header">
            <h1>Laplace's Chatbot</h1>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="chat-container">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>
                <span>{renderMessageContent(msg.content, index)}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {isTyping && (
            <p className="typing-indicator">Assistant is typing...</p>
          )}
          <div className="controls">
            <label className="tts-toggle">
              <input
                type="checkbox"
                checked={textToSpeechEnabled}
                onChange={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
              />
              Enable Text-to-Speech
            </label>
            <button
              className="voice-input-btn"
              onClick={startListening}
              disabled={isListening} // Disable button while listening
            >
              {isListening ? "Listening..." : "🎤 Voice Input"}
            </button>
          </div>
          <textarea
            className="textarea"
            rows="4"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {!isTyping && (
            <button
              className="ask-button"
              onClick={askQuestion}
              disabled={loading}
            >
              {loading ? "Loading..." : "Ask"}
            </button>
          )}
          {isTyping && (
            <button className="stop-button" onClick={stopTyping}>
              Stop
            </button>
          )}
        </>
      )}
    </div>
  );
}

// Login Component
const Login = ({ onLogin, setCurrentView, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome To Laplace's Chatbot</h1>
      <h2 className="login-title"> </h2>
      {error && <p className="error-message">{error}</p>}
      <div className="login-input-group">
        <input
          className="login-input"
          type="text"
          placeholder="What's your spy name?"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="What's the password?"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="login-actions">
        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
      <div className="register-redirect">
        Don't have an account?{" "}
        <button className="register-link" onClick={() => setCurrentView("register")}>
          Register here
        </button>
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onRegister, setCurrentView, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      await onRegister(username, password);
    } catch (err) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Welcome To Laplace's Chatbot</h1>
      <h2 className="register-title"> </h2>
      {error && <p className="error-message">{error}</p>}
      <div className="register-input-group">
        <input
          className="register-input"
          type="text"
          placeholder="Pick a name for your chatbot journey..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="Secure your journey with a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="register-button" onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <div className="login-redirect">
        Already have an account?{" "}
        <button className="login-link" onClick={() => setCurrentView("login")}>
          Login here
        </button>
      </div>
    </div>
  );
};

export default App;
