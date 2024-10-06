import React, { useMemo } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../styles/CodeBlock.css';
const CodeBlock = ({ code, language }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => alert("Code copied to clipboard!"));
  };

  const memoizedCode = useMemo(() => (
    <SyntaxHighlighter language={language} style={vs2015} key={`${language}-${Date.now()}`}>
      {code}
    </SyntaxHighlighter>
  ), [code, language]);

  return (
    <div className="code-block">
      <button className="copy-button" onClick={handleCopy}>
        Copy Code
      </button>
      <div className="code-syntax">
        {memoizedCode}
      </div>
    </div>
  );
};

export default CodeBlock;
