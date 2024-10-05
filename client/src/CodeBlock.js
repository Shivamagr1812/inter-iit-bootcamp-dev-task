import React, { useEffect, useMemo } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';

import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// Import languages
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);

const CodeBlock = ({ code, language }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  const memoizedCode = useMemo(() => (
    <SyntaxHighlighter language={language} style={vs2015} key={`${language}-${code}`}>
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
