const { gemini, geminiFileManager } = require("../config");

async function getGeminiResponseForFile(filePath, textPrompt){
    const uploadResponse = await geminiFileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: "Gemini 1.5 PDF",
    });

    const result = await gemini.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: textPrompt },
    ]);

    return result.response.text();
}

async function getGeminiResponseForText(textPrompt){
    const LLMResponse = await gemini.generateContent(textPrompt);
    return LLMResponse.response.text();
}

async function chatWithGeminiController(req, res) {
    const finalStringQuery = JSON.stringify({
        history: req.body.history,
        currentQuery: req.body.query
    })

    let LLMTextResponse = '';

    try {
        if (req.file) {
            LLMTextResponse = getGeminiResponseForFile(req.file.path, finalStringQuery);
        }
        else {
            LLMTextResponse = getGeminiResponseForText(finalStringQuery);
        }
    }
    catch (error) {
        LLMTextResponse = `Sorry, response couldn't be generated right now`;
        console.error(error);
    }

    res.json({
        role: 'Gemini',
        content: LLMTextResponse
    });
}

module.exports.chatWithGeminiController = chatWithGeminiController;