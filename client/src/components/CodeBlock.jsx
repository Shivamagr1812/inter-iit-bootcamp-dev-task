import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { qtcreatorDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { TiClipboard } from "react-icons/ti";

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  function handleCopyToClipboard() {
    navigator.clipboard
      .writeText(code.split("\n").slice(1).join("\n"))
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log("Error copying the text:", err);
      });
  }
  function extractLanguage() {}

  return (
    <div className="bg-black w-full rounded-md overflow-hidden font-sans font-thin">
      <div className="pt-1 px-4 pb-2 flex justify-between items-top relative text-lg text-gray-300">
        <p className="italic font-light text-base">{code.split("\n")[0]}</p>
        <p
          className="absolute right-10 top-[10px] text-sm text-gray-300 text-center duration-150"
          style={copied ? { opacity: 1 } : { opacity: 0 }}
        >
          Copied
        </p>
        <TiClipboard
          className="hover:text-gray-400 mt-2 cursor-pointer"
          onClick={handleCopyToClipboard}
        />
      </div>
      <SyntaxHighlighter
        language={
          code.split("\n")[0] === "bash" ? "javascript" : code.split("\n")[0]
        }
        style={qtcreatorDark}
        showLineNumbers
      >
        {code.split("\n").slice(1).join("\n")}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
