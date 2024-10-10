# Inter IIT Bootcamp Dev Task

## Setup
- Clone the repository
- To start client, run the following commands
```bash
cd client
npm install
npm start
```
- To start server, run the following commands
```bash
cd server
npm install
npx node index.js
```





## Chat Application Documentation
This documentation explains the key components, functions, and their usage within a React-based chat application. The application allows users to interact with an AI by submitting text prompts, uploading files, and recording audio.

1. Backend:
1.Dependencies:
body-parser: Middleware for parsing incoming request bodies in a middleware before handlers. In this case, it is used for handling JSON data.
cors: Enables Cross-Origin Resource Sharing, allowing requests from different domains.
multer: Middleware for handling file uploads. It stores uploaded files in the uploads/ directory.
mongoose: ODM (Object Data Model) for connecting to MongoDB and interacting with database schemas.
jsonwebtoken (jwt): Used for generating and verifying JWT tokens for user authentication.
dotenv: Loads environment variables from .env file, such as API keys, MongoDB connection strings, etc.
GoogleGenerativeAI & GoogleAIFileManager: These are used to communicate with Google’s Gemini API for AI-based functionalities, like generating responses based on prompts or file uploads.
ChatM & User: MongoDB models that represent chat and user data respectively.
2.User Registration:
POST /api/register: Handles user registration.
req.body: Retrieves the username, email, and password from the request body.
Checks: If any field is missing, the server returns a 400 error. If a user with the same email already exists, it returns a 409 conflict error.
Mongoose: A new user document is created and saved in MongoDB.
Responses: Upon successful registration, a 201 response is sent.
3.User Login Route:
POST /api/login: Logs in a user by validating the email and password.
JWT: If authentication is successful, a JWT token is generated for user authentication, expiring in 1 hour.
Password Comparison: The comparePassword method compares the hashed password in the database with the one provided by the user.

4.Chat Route:
POST /api/chat: Handles user chat requests.
User Validation: It verifies if the user exists based on the username.
Chat History: Fetches chat history from MongoDB and sends it to the Google Gemini AI to maintain context.
AI Response: The AI generates a response based on the user’s prompt and chat history.
ChatM: A new chat document is created and saved to MongoDB, ensuring chat history is preserved.

5.Fetch Chat History:
GET /api/chat/history: Retrieves the chat history for a specific user.
Response: Returns the formatted chat history, showing user prompts and AI responses.

6.File Upload Route:
POST /api/file: Handles file uploads along with user chat prompts.
File Processing: The uploaded file is stored temporarily, then uploaded to Google Gemini using fileManager.uploadFile.
AI Response: The AI generates a response based on both the file content and the user’s prompt.

7.Audio Upload Route:
POST /api/audio: Similar to the file upload route but for audio files.
Audio File: Uploaded and processed similarly to files, where the AI uses the audio content to generate a response.

2.frontend:

Login Component
Allows existing users to log in.
Props:
•	setUsername: Updates the parent component's username state.
State Variables:
•	email, password: Store user inputs.
•	error, success: Handle feedback messages.
Function:
•	handleSubmit: Submits the form, sends login data via a POST request, and handles success (stores token, updates username, navigates home) or error messages.
Rendering:
•	Email/password input form, submit button, error/success messages, and a link to the signup page.

Signup Component
Registers new users.
State Variables:
•	username, email, password: Store user inputs.
•	error, success: Handle feedback messages.
Function:
•	handleSubmit: Submits the form, sends registration data via POST request, handles success (shows message, redirects to login) or error messages.
Rendering:
•	Username/email/password form, submit button, error/success messages.

Chat Component
The Chat component serves as the main interface for user interaction. It maintains the state of user inputs, chat history, and manages file uploads and audio recordings.
Props
username: The name of the user interacting with the chat.
State Variables
prompt: Stores the text input from the user.
history: An array that holds the chat history, including messages from both the user and AI.
loading: A boolean indicating if a request is being processed.
file: Stores the uploaded file (if any).
audioBlob: Stores the recorded audio data (if any).
isRecording: A boolean indicating if audio recording is in progress.
2. useEffect Hooks
a. Fetching Chat History
Purpose: Fetches the user's previous chat history from the server when the component mounts.
Usage: Automatically populates the chat history for a smoother user experience.
b. Auto-Scroll to Chat End
Purpose: Automatically scrolls to the bottom of the chat whenever the history updates.
Usage: Ensures that the latest messages are always visible.
3. handleQuestionSubmit Function
Purpose: Validates the user input and sends it to the appropriate API endpoint based on the input type (text, file, or audio).
Usage: Processes user inputs and updates the chat history with AI responses.
4. extractCodeBlock Function
Purpose: Identifies and extracts code enclosed in triple backticks from the AI's response.
Usage: Enables syntax highlighting for code snippets in chat messages.
5. handleFileSelection Function
Purpose: Updates the state with the selected file.
Usage: Prepares the file for upload when the user selects it.
6. startRecording and stopRecording Functions
Purpose: Manages the audio recording process using the MediaRecorder API.
Usage: Starts and stops the recording of audio, storing the data for later submission.
7. ChatMessages Component
Purpose: Displays the messages from the user and the AI.
Usage: Iterates over the chat history and renders each message with appropriate formatting.
8. removeSelectedFile Function
Purpose: Resets the file state when the user removes a selected file.
Usage: Allows the user to clear the uploaded file if they change their mind.
9. Rendering the Component
The component's rendering logic includes:
A display of chat messages using ChatMessages.
File input and audio recording controls.
Submission button for the user to send their input.



deployment link -
https://idkk-phi.vercel.app/login

