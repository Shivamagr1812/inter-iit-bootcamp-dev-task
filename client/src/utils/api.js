import axios from "axios";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Set up axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,  // API key passed in headers
  },
});

// Function to generate content using a given prompt
export const generateContent = async (prompt) => {
  const data = {
    prompt: { text: prompt },  // Construct the request body as needed by the API
  };

  try {
    const response = await api.post("", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Function to fetch data directly using provided request body
export const fetchDataFromApi = async (data) => {
  try {
    const response = await api.post("", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Utility function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error("Server Error:", error.response.status, error.response.data);
  } else if (error.request) {
    console.error("No Response received:", error.request);
  } else {
    console.error("Error:", error.message);
  }
};
