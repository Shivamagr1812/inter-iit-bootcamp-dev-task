import React from 'react';

const InputSection = ({ question, setQuestion, askQuestion, loading }) => {
  return (
    <div>
      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button className="button" onClick={askQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
    </div>
  );
};

export default InputSection;
