const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatCodeBlocks = (text) => {
  return text.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const languageClass = lang ? `class="${lang}"` : "";
    // Escape HTML special characters to prevent formatting issues
    const escapedCode = escapeHtml(code.trim());
    // Return formatted code block with <pre> and <code> tags
    return `<pre><code ${languageClass}>${escapedCode}</code></pre>`;
  });
};

module.exports = { formatCodeBlocks };
