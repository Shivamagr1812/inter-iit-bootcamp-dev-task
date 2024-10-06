import React, { useEffect, useRef, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdKeyboardVoice } from "react-icons/md";
import { TbFileUpload } from "react-icons/tb";
import { MdOutlineFileUpload } from "react-icons/md";

function InputField({ addConversation }) {
  const [msg, setMsg] = useState({
    role: "user",
    content: "",
    file: null,
  });
  const [transcript, setTranscript] = useState("");
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isFileUploadActive, setIsFileUploadActive] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  // Function to send 'msg' to 'addConversation' function
  const handleSend = (msg) => {
    addConversation(msg);
    setMsg({
      role: "user",
      content: "",
      file: null,
    });
  };

  // Function to take voice input, convert to text (transcript)
  const handleSpeech = () => {
    setIsSpeechActive(true);
    const recognition = new (window.speechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = "en-us";

    recognition.onresult = (event) => {
      setIsSpeechActive(false);
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setIsSpeechActive(false);
      console.error("Error occured in recognition:", event.error);
    };
    // Start taking the voice input
    recognition.start();
  };

  // Function to trigger hidden file input element
  const handleFileUpload = () => {
    fileInputRef.current.click();
    setIsFileUploadActive(false);
  };

  // Function to validate file size and allowed file types
  const handleFile = (event) => {
    let file = event.target.files[0];

    if (file) {
      // Size validate
      if (file.size > MAX_FILE_SIZE) {
        console.log("File size exceeds the 5MB limit");
        return;
      }
      // File type validate
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        console.log("Invalid file type");
        return;
      }

      // Correct file uploaded
      msg.file = file;
    }
  };

  // To send voice input to backend
  useEffect(() => {
    if (transcript.length > 0) {
      handleSend({ ...msg, content: transcript });
    }
  }, [transcript]);

  return (
    <div className="h-[70px] w-full fixed bottom-0 flex justify-center items-center bg-[#131921] z-[1000]">
      <div className="w-3/4 md:w-1/2 relative flex">
        <div
          className="absolute top-3 -left-8 md:-left-10 text-3xl flex items-center cursor-pointer duration-150  text-gray-300"
          onClick={handleSpeech}
        >
          <p
            className="absolute text-sm -left-20"
            style={isSpeechActive ? { opacity: 1 } : { opacity: 0 }}
          >
            Speak now
          </p>
          <MdKeyboardVoice className="hover:scale-110" />
        </div>
        <div className="absolute left-6 top-4 text-xl cursor-pointer text-gray-300">
          <div
            className="absolute w-[250px] h-fit py-3 bottom-10 rounded-lg bg-gray-700"
            style={
              isFileUploadActive ? { display: "inline" } : { display: "none" }
            }
          >
            <div
              className="flex items-center justify-center gap-2 hover:text-gray-400"
              onClick={handleFileUpload}
            >
              <MdOutlineFileUpload />
              <p className="text-base">Upload from computer</p>
            </div>
          </div>
          <TbFileUpload
            className="hover:text-gray-400"
            onClick={() => setIsFileUploadActive((prev) => !prev)}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden text-xs"
          />
        </div>
        <input
          type="text"
          name="input"
          placeholder="Ask something..."
          className="w-full px-7 pl-16 py-3 text-lg outline-none rounded-full text-gray-200 bg-[#19212c] shadow-lg"
          value={msg.content}
          onChange={(e) => setMsg({ ...msg, content: e.target.value })}
          onKeyDown={(e) => (e.key === "Enter" ? handleSend(msg) : null)}
        />
        <div
          className="absolute flex items-center justify-center p-1 right-5 top-[27px] -translate-y-[50%] text-gray-300 cursor-pointer text-2xl"
          onClick={() => handleSend(msg)}
        >
          <CiLocationArrow1 className="hover:text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default InputField;
