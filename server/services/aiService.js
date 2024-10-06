const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to convert a file to a format compatible with the generative model
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
            mimeType,
        },
    };
}

const generateResponse = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the correct model

    // Directory where the files are stored
    const directoryPath = path.join(__dirname, '../File');
    
    // Read all files from the directory
    const files = fs.readdirSync(directoryPath);
    
    // Create an array of file parts
    const fileParts = files.map(file => {
        const filePath = path.join(directoryPath, file);
        const ext = path.extname(file).toLowerCase();

        let mimeType;
        // Determine the MIME type based on file extension
        switch (ext) {
            case '.png':
                mimeType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                mimeType = 'image/jpeg';
                break;
            case '.pdf':
                mimeType = 'application/pdf';
                break;
            case '.txt':
                mimeType = 'text/plain';
                break;
            // Add more file types as needed
            default:
                return null; // Skip unsupported file types
        }
        
        return fileToGenerativePart(filePath, mimeType); // Convert file to generative part
    }).filter(part => part !== null); // Filter out null values

    try {
        // Generate content based on the prompt and any image parts
        const result = await model.generateContent([prompt, ...fileParts]);
        
        // Wait until the response is fully retrieved
        const response = await result.response;
        const text = await response.text(); // Fully await the response text

        console.log("Generated Response:", text);

        // Delete all processed files after processing
        files.forEach(file => {
            fs.unlinkSync(path.join(directoryPath, file)); // Delete the file
        });

        // Return the formatted response
        return text;

    } catch (error) {
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response");
    }
};

module.exports = { generateResponse };
