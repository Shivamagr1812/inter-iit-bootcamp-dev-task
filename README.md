# VenusX : AI-Powered Chat Website<br>
## <a href = "https://interiitps-frontend.onrender.com/">VenusX</a><br>
This project is part of the <strong>InterIIT 13.0 TechMeet BootCamp 2024-25</strong>. The goal is to build a feature-rich chat website using the OpenAI API, incorporating several key functionalities like code snippet support, file uploads, voice chat, user authentication, chat history preservation, and deployment.

Process Documentation<br>
<strong>1. Setting up the Project</strong>
Cloned the boilerplate code provided in the resources section.
Set up the environment by installing dependencies using:<br>
```git clone```<br>
```npm install```<br>
Integrated the <strong>Gemini</strong> API for chat functionality.<br>
Created a simple chat interface as the main user interaction point.<br><br>
<strong>2. Implementing Code Snippets Support</strong><br>
Integrated highlight.js and used regex expressions to add syntax highlighting for code snippets.<br>
Added a copy-to-clipboard feature using clipboard.js for easy sharing of code blocks.
Ensured proper formatting and display of code blocks in the chat.<br><br>
<strong>3. Real-Time Streaming of Responses</strong>
Implemented real-time streaming of Gemini API stream functions .
This allowed progressive loading of AI responses, ensuring smooth user interaction.<br><br>
<strong>4. File Upload Support</strong>
Added file upload functionality using Multer to handle file uploads securely.
Implemented validation for file types and size limits to ensure only appropriate files are processed.
Integrated file content into the chat context, allowing the AI to respond based on uploaded files.<br><br>
<strong>5. Voice Chat Integration</strong>
Used the React speech recognition library to implement speech-to-text for user input.
Integrated text-to-speech functionality for AI responses, providing a voice chat option.
Handled the complexities of managing audio streams, ensuring the system worked seamlessly for both voice input and output.<br><br>
<strong>6. User Authentication</strong>
Added user registration and login functionality using JWT (JSON Web Tokens) for authentication and cookies for higher security.
Managed user sessions to ensure secure access to chat functionalities.
Integrated authentication with chat, allowing users to maintain personalized sessions.<br><br>
<strong>7. Chat History Preservation</strong>
Integrated MongoDB to store chat logs for each user, ensuring that chat history could be retrieved later.
Created a feature that allows users to continue past conversations.
Focused on ensuring data privacy and security by securing sensitive information.<br><br>
<strong>8. Deployment</strong>
Deployed the application to Render (or another platform).
Ensured that all the features work correctly in the deployed environment.
Wrote a brief documentation guide on how to use the platform, including setup steps for future developers.
Conclusion
This project integrates a range of features into a single, cohesive chat platform, highlighting AI-powered capabilities alongside a seamless user experience. From basic chat to advanced features like voice interaction, the project demonstrates the potential of integrating AI into web-based communication.

Next Steps
Continue refining the UI for better user experience.
Add more file processing capabilities, potentially extending support for different types of content analysis.
This README documents the key stages of your development process. Let me know if you’d like to adjust or add anything!

### To setup the wbsite locally
#### Backend 
    npm run install server && npm run start-server
#### Frontend
    npm run install-client && npm run build-client && npm start-client
