import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiEdgeNewLine } from "react-icons/ri";
import CodeBlock from "./CodeBlock";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { GoDownload } from "react-icons/go";

function Message({ msg }) {
  const [segmentArr, setSegmentArr] = useState([]);

  // If ai sends mixed response (code,headings,plain text)
  useEffect(() => {
    if (msg.role === "ai") {
      function extractSegments(input) {
        const segments = [];
        let temp = "";
        let temp2 = "";

        input = input.replaceAll("`", "'");

        for (let i = 0; i < input.length; i++) {
          // Code block
          if (
            input[i] === "'" &&
            input[i + 1] === "'" &&
            input[i + 2] === "'"
          ) {
            segments.push({ type: "normal text", content: temp2 });
            temp2 = "";

            for (let j = i + 3; j < input.length; j++) {
              if (
                input[j] === "'" &&
                input[j + 1] === "'" &&
                input[j + 2] === "'"
              ) {
                i = j + 2;
                break;
              } else {
                temp += input[j];
              }
            }

            segments.push({ type: "code", content: temp });
            temp = "";
          }
          // Italic
          if (
            input[i] === "*" &&
            input[i + 1] === "*" &&
            input[i + 2] === "'"
          ) {
            segments.push({ type: "normal text", content: temp2 });
            temp2 = "";
            for (let j = i + 3; j < input.length; j++) {
              if (input[j] === "*" && input[j + 1] === "*") {
                break;
              }
              if (
                input[j] === "'" &&
                input[j + 1] === ":" &&
                input[j + 2] === "*" &&
                input[j + 3] === "*"
              ) {
                i = j + 3;
                segments.push({ type: "italic", content: temp });
                temp = "";
                break;
              } else {
                temp += input[j];
              }
            }
          }
          //Highlighted text
          if (input[i] === "*" && input[i + 1] === "*") {
            segments.push({ type: "normal text", content: temp2 });
            temp2 = "";
            for (let j = i + 2; j < input.length; j++) {
              if (input[j] === "*" && input[j + 1] === "*") {
                i = j + 2;
                break;
              } else {
                temp += input[j];
              }
            }

            segments.push({ type: "heading", content: temp });
            temp = "";
          }
          // Normal text
          if (input[i] !== "*" && input[i] !== "'") {
            temp2 += input[i];
          }
        }
        if (temp2.length > 0) {
          segments.push({ type: "normal text", content: temp2 });
        }
        return segments;
      }

      setSegmentArr(extractSegments(msg.content));
    }
  }, [msg]);

  // Function for text-to-speech of ai responses
  const handleSpeech = () => {
    let text = "";

    segmentArr.forEach((segment) => {
      text += segment.content;
    });

    function speak(text) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speeches

        const utterance = new SpeechSynthesisUtterance(
          text || "Hello, this is a test message."
        );

        // Check if voices are loaded
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.speak(utterance);
          };
        } else {
          window.speechSynthesis.speak(utterance);
        }
      } else {
        alert("Sorry, your browser does not support text-to-speech.");
      }
    }

    speak(text);
  };

  const handleDownloadFile = (file) => {
    console.log(file);
  };

  // Function to show Preview of file on Coversation Section
  const renderFilePreview = (file) => {
    // If no file
    if (!file) {
      return null;
    }
    // If file type is image
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="file"
          className="bg-gray-400"
        />
      );
    }
    // If file is of another type
    else {
      return (
        <div
          className="flex items-center max-h-20 max-w-[80%] overflow-hidden p-3 rounded-lg relative bg-[#0d1117]"
          onClick={() => handleDownloadFile(file)}
        >
          <p className="max-w-[80%]">{file.name}</p>
          <a
            className="absolute right-4 text-2xl"
            href={URL.createObjectURL(file)}
            download={file.name}
            title="Download"
          >
            <GoDownload />
          </a>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-fit px-3 sm:px-5 py-1 md:py-2 flex items-start gap-1 md:gap-3 relative text-gray-300 font-sans">
      <div className="md:w-[36px] md:h-[36px] flex text-start mt-[11px] text-2xl md:text-4xl">
        {msg.role === "ai" ? <RiEdgeNewLine /> : <CiUser />}
      </div>
      <div className="flex flex-col gap-3 w-full align-middle px-2 sm:px-5 py-4 rounded-lg">
        {msg.role === "user" ? (
          <>
            <p>{msg.content}</p>
            <div className="max-w-[80%]">{renderFilePreview(msg.file)}</div>
          </>
        ) : (
          segmentArr.length > 0 &&
          segmentArr.map((segment, index) => {
            if (segment.type === "normal text") {
              return <p key={index}>{segment.content}</p>;
            } else if (segment.type === "italic") {
              return (
                <p
                  key={index}
                  className="italic font-mono px-2 py-1 w-fit rounded-lg bg-gray-700"
                >
                  {segment.content}
                </p>
              );
            } else if (segment.type === "heading") {
              return (
                <p key={index} className="font-extrabold text-xl">
                  {segment.content}
                </p>
              );
            } else if (segment.type === "code") {
              return <CodeBlock key={index} code={segment.content} />;
            }
          })
        )}
      </div>
      {msg.role === "ai" ? (
        <div
          className="absolute right-2 hover:scale-105 cursor-pointer"
          onClick={handleSpeech}
        >
          <HiOutlineSpeakerWave />
        </div>
      ) : null}
    </div>
  );
}

export default Message;
