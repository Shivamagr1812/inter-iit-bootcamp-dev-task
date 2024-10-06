// src/components/TextareaInput.js
import React from 'react';

const TextareaInput = ({ question, setQuestion }) => (
  <textarea
    className="textarea"
    rows="4"
    placeholder="Ask a question..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
  />
);

export default TextareaInput;
