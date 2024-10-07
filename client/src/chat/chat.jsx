import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import showdown from 'showdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faPaperPlane, faTrash, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from '@fortawesome/free-regular-svg-icons'


function Chat() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const chatEndRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://interiitps.onrender.com';

    useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/users`, {
          withCredentials: true,
        });
        console.log(response.data.username);
        setUsername(response.data.username);
      } catch (error) {
        // alert('login again!');
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [backendUrl]);
  
  function speak(val) {
    let utterance = new SpeechSynthesisUtterance(val);
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === "Google UK English Female");
    utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
  }

  // Speech recognition hooks
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  // Effect to update the question state with the latest transcript
  useEffect(() => {
    setQuestion(transcript); // Update question with the current transcript
  }, [transcript]);

  // Check if the browser supports speech recognition
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const startListening = () => {
    resetTranscript(); // Optional: reset transcript only if desired
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const codeHighlightExtension = () => {
    return [
      {
        type: 'output',
        filter(text) {
          const regex = /<pre><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/g;
          return text.replace(regex, (match, code) => {
            const highlighted = hljs.highlightAuto(code).value;
            return `<pre class="bg-gray-500 p-1 rounded-none"><code class="hljs">${highlighted}</code></pre>`;
          });
        },
      },
    ];
  };

  const converter = new showdown.Converter({ extensions: [codeHighlightExtension] });

  const askQuestionStream = async (e) => {
    e.preventDefault();
    if (!question.trim() && !file) {
      alert('Please enter a question or upload a file.');
      return;
    }

    setLoading(true);
    let response;
    try {
      if (file) {
        const formData = new FormData();
        formData.append("prompt", question);
        formData.append("newChat", false);
        formData.append("file", file);
        response = await fetch(`${backendUrl}/api/v1/chat/upload`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
          
        });
      } else {
        response = await fetch(`${backendUrl}/api/v1/chat/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: question,
            newChat: false,
          }),
          
        });
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = '';

      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = JSON.parse(chunk);
        if (parsedChunk.data) {
          accumulatedMessage += parsedChunk.data;

          setConversation((prev) => {
            let lastBotMessage = prev[prev.length - 1];
            if (lastBotMessage && lastBotMessage.role === 'bot') {
              return [
                ...prev.slice(0, -1),
                { ...lastBotMessage, content: accumulatedMessage },
              ];
            } else {
              return [
                ...prev,
                { role: 'bot', content: accumulatedMessage },
              ];
            }
          });

          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }

      setQuestion('');
      setFile(null);
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hello = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/chat/`);
      const chats = response.data.data;

      if (chats.length !== 0) {
        speak(chats[chats.length - 1].parts[0].text);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const deleteChat = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${backendUrl}/api/v1/chat/`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setConversation([]);
        alert('Chats deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting chats:', error);
      alert('Failed to delete chats.');
    } finally {
      setLoading(false);
    }
  };

  const convertToHtml = (content) => {
    const html = converter.makeHtml(content);
    const decodedHtml = html.replace(/&(lt|gt|amp);/g, (match, entity) => {
      switch (entity) {
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        case 'amp':
          return '&';
        default:
          return match;
      }
    }).replace(/&quot;/g, '"');

    return { __html: decodedHtml };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyNotification(true);
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        notificationTimeoutRef.current = setTimeout(() => {
          setCopyNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
      });
  };

  const containsCode = (content) => {
    const regex = /<pre><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/;
    return regex.test(content);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <>
      <div className="h-auto min-h-[100vh] w-[100%] bg-[#060f2b] text-white flex items-center justify-center">
        <div className="w-[60%] p-8 flex flex-col bg-[#060f2b] h-auto">
          {copyNotification && (
            <div className="absolute top-10 right-0 bg-green-500 text-white p-2 rounded-md mt-4 mr-4">
              Copied!
            </div>
          )}
          <a className=" absolute top-6 left-6 w-fit text-white" href="/">
            <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 320 512"
                className="mr-3 h-[13px] w-[8px] text-white dark:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
              </svg>
              <p className="ml-0 text-sm text-white">Back to the website</p>
            </div>
          </a>

          <div className="absolute top-6 right-6 text-base font-semibold text-white">
            Welcome, {username}!
          </div>
          <h1 className="text-4xl font-extrabold text-center mb-4">Chat with VenusX</h1>
          <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 shadow-lg mb-4 min-h-[300px] flex flex-col">
            {conversation.map((msg, index) => (
              <div key={index} className="mb-2 flex items-start">
                <strong className={`mr-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-red-600'}`}>
                  {msg.role === 'user' ? 'You' : 'GPT-4'}:
                </strong>
                <div
                  dangerouslySetInnerHTML={convertToHtml(msg.content)}
                  className="flex-1 markdown-body"
                />
                {msg.role === 'bot' && (
                  <>
                    {/* <button
                      onClick={() => {
                        copyToClipboard(msg.content.replace(/<[^>]*>/g, ''));
                      }}
                      className="ml-2 bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 text-sm"
                    >
                      Copy Response
                    </button> */}
                    <div onClick={() => {
                      copyToClipboard(msg.content.replace(/<[^>]*>/g, ''));
                    }} className='hover:cursor-pointer h-3 w-3 mr-2 text-base text-white'><FontAwesomeIcon className="text-[#828282]" icon={faCopy} /></div>

                    <div onClick={() => speak(msg.content.replace(/<[^>]*>/g, ''))} className=' text-base hover:cursor-pointer h-3 w-3 mr-2 text-white'><FontAwesomeIcon className="text-[#828282]" icon={faVolumeHigh} /></div>
                    {/* <button
                      onClick={() => speak(msg.content.replace(/<[^>]*>/g, ''))}
                      className="ml-2 bg-purple-500 text-white py-1 px-2 rounded-md hover:bg-purple-600 text-sm"
                    >
                      Speak Response
                    </button> */}
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex space-x-2 mb-4 items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question or dictate..."
              className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500"
            />
            {/* <button
              onClick={askQuestionStream}
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Send'}
            </button> */}




            {/* Speech recognition buttons */}
            {/* <button
              onClick={startListening}
              className={`bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 ${listening ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={listening}
            >
              🎤 Start
            </button> */}


            <div
              onClick={askQuestionStream}
              disabled={loading}
              className={` hover:cursor-pointer hover:opacity-70 flex justify-center items-center text-white h-10 w-10 rounded-full bg-[#0e2054] ${loading ? 'opacity-50 cursor-not-allowed' : ''
                } `}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>


            <div
              onClick={startListening}
              disabled={listening}
              className={`flex justify-center items-center text-white h-10 w-10 rounded-full bg-[#0e2054] ${listening ? 'opacity-50 cursor-not-allowed' : ''
                } hover:cursor-pointer hover:opacity-70`}
            >
              <FontAwesomeIcon icon={faMicrophone} />
            </div>



            <div
              onClick={stopListening}
              disabled={!listening}
              className={`hover:cursor-pointer flex justify-center items-center text-white h-10 w-10 rounded-full bg-[#0e2054] ${!listening ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FontAwesomeIcon
                className={`${!listening ? 'opacity-50 cursor-not-allowed' : ''}`}
                icon={faMicrophoneSlash} />
            </div>

            {/* <button
              onClick={stopListening}
              className={`bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 ${!listening ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!listening}
            >
              Stop
            </button> */}
          </div>

          <>
            <div className="mb-4 flex items-center justify-between">
              <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-700 bg-gray-800 text-white py-2 px-4 rounded-lg"
              />

              {/* <button onClick={deleteChat} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"> */}
                
              {/* </button> */}

              <div onClick={deleteChat}  className='h-10 w-20 flex justify-center items-center rounded-full hover:cursor-pointer hover:bg-red-600  bg-red-500 text-white'><FontAwesomeIcon
                className='text-white'
                icon={faTrash} /> <p className='font-semibold ml-1'>Chat</p>
              </div>


            </div>

          </>

        </div>
      </div>
    </>
  );
}

export default Chat;
