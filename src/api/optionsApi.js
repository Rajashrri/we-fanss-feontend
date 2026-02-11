// src/api/optionsApi.js
import httpClient from "../config/http/httpClient";

/**
 * Get celebrity options
 * @param {string[]} excludeList - Array of celebrity IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getCelebrityOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/celebrities', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrity options:", error);
    throw error;
  }
};

/**
 * Get language options
 * @param {string[]} excludeList - Array of language IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getLanguageOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/languages', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching language options:", error);
    throw error;
  }
};

/**
 * Get social link options
 * @param {string[]} excludeList - Array of social link IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getSocialLinkOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/social-links', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching social link options:", error);
    throw error;
  }
};

/**
 * Get trivia type options
 * @param {string[]} excludeList - Array of trivia type IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getTriviaTypeOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/trivia-types', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching trivia type options:", error);
    throw error;
  }
};

/**
 * Get profession options
 * @param {string[]} excludeList - Array of profession IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getProfessionOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/professions', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching profession options:", error);
    throw error;
  }
};


/**
 * Get genre options
 * @param {string[]} excludeList - Array of genre IDs to exclude (optional)
 * @returns {Promise<{success: boolean, message: string, data: Array<{id: string, label: string}>}>}
 */
export const getGenreOptions = async (excludeList = []) => {
  try {
    const response = await httpClient.post('/options/genres', { excludeList });
    return response.data;
  } catch (error) {
    console.error("Error fetching genre options:", error);
    throw error;
  }
};