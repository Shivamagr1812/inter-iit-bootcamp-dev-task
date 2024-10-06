# Gemini Chatbot
Your digital assistant, always ready to help.

## Purpose
This project was developed for a hackathon with the goal of creating a functional chatting website using the Gemini API. The platform supports real-time communication between user and Gemini, file uploads, and features such as document summarization and question-answering using AI

## Build
### Environment Setup
First, set the `GOOGLE_API_KEY` variable in your environment to your Google Gemini API token that can be obtained from [here](https://ai.google.dev/gemini-api/docs/api-key).
Then, create a MongoDB cluster following the instructions on [this](https://www.mongodb.com/docs/guides/atlas/cluster/) page, then obtain your connection string (see [this](https://www.mongodb.com/docs/guides/atlas/connection-string/)) and export it to the `MONGODB_CLUSTER` environment variable.

### Dependencies
This project was built using Node.JS and all the dependencies required to run it can be installed by running `npm i`.

### Running
To view the website, run `node index.js` and navigate to [`localhost:3000`](https://localhost:3000).

---

To view formal documentation, see [this](./documentation.pdf)
