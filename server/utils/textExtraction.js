const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

// Function to extract text from PDF
const extractTextFromPDF = (filePath) => {
  return pdf(fs.readFileSync(filePath)).then((data) => data.text);
};

// Function to extract text from Word document
const extractTextFromWord = (filePath) => {
  return mammoth.extractRawText({ path: filePath }).then((result) => result.value);
};

// Function to determine file type and extract text
async function extractText(file) {
  const filePath = path.join(__dirname, '../uploads/', file.filename);
  const fileExtension = path.extname(file.originalname).toLowerCase();
  let extractedText = '';

  // Extract text based on file type
  if (fileExtension === '.pdf') {
    extractedText = await extractTextFromPDF(filePath);
  } else if (fileExtension === '.docx' || fileExtension === '.doc') {
    extractedText = await extractTextFromWord(filePath);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or Word document.');
  }

  console.log(`Extracted text from file: ${extractedText}`);
  return extractedText;
}

module.exports = { extractText };
