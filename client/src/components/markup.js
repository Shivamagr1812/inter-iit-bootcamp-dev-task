import React from 'react';
import { marked } from 'marked';

class MarkupFormatter extends React.Component {
  render() {
    const { text } = this.props;
    const getMarkup = () => {
      return { __html: marked(text) };
    };

    return <div dangerouslySetInnerHTML={getMarkup()} />;
  }
}

export default MarkupFormatter;