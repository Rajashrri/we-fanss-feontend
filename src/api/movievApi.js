// src/api/movievApi.js
import httpClient from "../config/http/httpClient";

/**
 * Get language options
 */
export const getLanguageOptions = async () => {
  try {
    const response = await httpClient.get('/Movie/languageOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching language options:", error);
    throw error;
  }
};

/**
 * Get professions options
 */
export const getProfessionsOptions = async () => {
  try {
    const response = await httpClient.get('/Movie/professionsOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching profession options:", error);
    throw error;
  }
};

/**
 * Add a new movie
 * @param {FormData} formData - Movie data with image
 */
export const addMoviev = async (formData) => {
  try {
    const response = await httpClient.post('/movie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

/**
 * Get all movies by celebrity ID
 * @param {string} id - Celebrity ID
 */
export const getMoviesByCelebrity = async (id) => {
  try {
    const response = await httpClient.get(`/movie/celebrity/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by celebrity:", error);
    throw error;
  }
};

/**
 * Delete a movie
 * @param {string} id - Movie ID
 */
export const deleteMoviev = async (id) => {
  try {
    const response = await httpClient.delete(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

/**
 * Get movie by ID
 * @param {string} id - Movie ID
 */
export const getMovievById = async (id) => {
  try {
    const response = await httpClient.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    throw error;
  }
};

/**
 * Update an existing movie
 * @param {string} id - Movie ID
 * @param {FormData} formData - Updated movie data
 */
export const updateMoviev = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/movie/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    return { status: false, msg: "Network error" };
  }
};

/**
 * Get genre master options
 */
export const getGenreMaster = async () => {
  try {
    const response = await httpClient.get('/Moviev/GenreMasterOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching genre master:", error);
    throw error;
  }
};

/**
 * Update movie status only
 * @param {string} id - Movie ID
 * @param {string} status - New status
 */
export const updateMovieStatus = async (id, status) => {
  try {
    const response = await httpClient.patch(`/movie/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating movie status:", error);
    throw error;
  }
};

/**
 * Get social links options
 */
export const getSocialLinksOptions = async () => {
  try {
    const response = await httpClient.get('/Moviev/sociallist');
    return response.data;
  } catch (error) {
    console.error("Error fetching social link options:", error);
    throw error;
  }
};