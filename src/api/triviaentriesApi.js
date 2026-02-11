// src/api/triviaentriesApi.js
import httpClient from '../config/http/httpClient';

/**
 * Add new trivia entry
 * @param {FormData} formData - Form data with trivia entry details
 * @returns {Promise}
 */
export const addtriviaentries = async (formData) => {
  try {
    const response = await httpClient.post('/triviaentries/addtriviaentries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add trivia entry');
  }
};

/**
 * Get trivia entries by celebrity ID with filters
 * @param {string} celebrityId - Celebrity ID
 * @param {object} filters - Filter options { moderationState, status, search, page, limit }
 * @returns {Promise}
 */
export const getTriviaentries = async (celebrityId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.moderationState) params.append('moderationState', filters.moderationState);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = `/triviaentries/getdatatriviaentries/${celebrityId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia entries');
  }
};

/**
 * Get trivia entry by ID
 * @param {string} id - Trivia entry ID
 * @returns {Promise}
 */
export const getTriviaentriesById = async (id) => {
  try {
    const response = await httpClient.get(`/triviaentries/gettriviaentriesByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia entry');
  }
};

/**
 * Update trivia entry
 * @param {string} id - Trivia entry ID
 * @param {FormData} formData - Form data with updated details
 * @returns {Promise}
 */
export const updateTriviaentries = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/triviaentries/updatetriviaentries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia entry');
  }
};

/**
 * Update trivia entry status
 * @param {string} id - Trivia entry ID
 * @param {number} status - Status (0 or 1)
 * @returns {Promise}
 */
export const updateTriviaentriesStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/triviaentries/update-statustriviaentries', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia entry status');
  }
};

/**
 * Delete trivia entry
 * @param {string} id - Trivia entry ID
 * @returns {Promise}
 */
export const deleteTriviaentries = async (id) => {
  try {
    const response = await httpClient.delete(`/triviaentries/deletetriviaentries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete trivia entry');
  }
};