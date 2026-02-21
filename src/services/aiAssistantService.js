/**
 * AI Assistant Service
 * Handles communication with the RAG-powered backend API
 */

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  // Force HTTPS if serving page over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.startsWith('http://')) {
    return envUrl.replace('http://', 'https://');
  }
  return envUrl;
};

const API_BASE_URL = getApiUrl();
const AI_CHAT_ENDPOINT = '/api/ai-assistant/chat';
const AI_HISTORY_ENDPOINT = '/api/ai-assistant/history';

/**
 * Send a message to the AI Assistant and get a response
 * @param {string} message - The user's message
 * @param {string} userRole - Either "patient" or "therapist"
 * @param {string} token - The authentication token
 * @returns {Promise<string>} The AI's response
 * @throws {Error} If the API request fails
 */
export async function chatWithAssistant(message, userRole, token) {
  try {
    const response = await fetch(`${API_BASE_URL}${AI_CHAT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: message,
        user_role: userRole,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Assistant API Error:', error);
    throw new Error(
      error.message || 'Failed to communicate with AI Assistant. Please try again.'
    );
  }
}

/**
 * Fetch chat history from the backend
 * @param {string} token - The authentication token
 * @returns {Promise<Array>} List of chat messages
 * @throws {Error} If the API request fails
 */
export async function fetchChatHistory(token) {
  try {
    const response = await fetch(`${API_BASE_URL}${AI_HISTORY_ENDPOINT}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Assistant History Error:', error);
    throw new Error(
      error.message || 'Failed to fetch chat history. Please try again.'
    );
  }
}
