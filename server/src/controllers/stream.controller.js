const OpenAI = require("openai");

// Initialize OpenAI

const handleStream = async (req, res) => {
  const msg = "Hello Gpt, How are you!";

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: msg }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);

  res.end("Hello from Server");
};

module.exports = handleStream;
