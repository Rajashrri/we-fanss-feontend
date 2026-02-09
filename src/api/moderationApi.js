// moderationApi.js
import httpClient from "../config/http/httpClient";

/**
 * Get list of celebrities with pending items
 * @param {Object} params - { page?, limit?, search? }
 */
export const getCelebritiesForModeration = async (params = {}) => {
  try {
    const response = await httpClient.get('/moderation/celebrity/list', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrities for moderation:", error);
    throw error;
  }
};

/**
 * Get pending summary for a specific celebrity
 * @param {string} celebrityId - Celebrity ID
 */
export const getCelebrityPendingSummary = async (celebrityId) => {
  try {
    const response = await httpClient.get(`/moderation/celebrity/${celebrityId}/pending-summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrity pending summary:", error);
    throw error;
  }
};

/**
 * Get pending items for a specific module
 * @param {string} module - Module name (celebrity, movie, timeline, etc.)
 * @param {Object} params - { page?, limit?, search?, celebrity?, sectionId? }
 */
export const getPendingItems = async (module, params = {}) => {
  try {
    const response = await httpClient.get(`/moderation/${module}/pending`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching pending ${module} items:`, error);
    throw error;
  }
};

/**
 * Get moderation statistics for a specific module
 * @param {string} module - Module name (celebrity, movie, timeline, etc.)
 * @param {Object} params - { sectionId? }
 */
export const getModerationStats = async (module, params = {}) => {
  try {
    const response = await httpClient.get(`/moderation/${module}/stats`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${module} stats:`, error);
    throw error;
  }
};

/**
 * Get all items for a specific module with optional filters
 * @param {string} module - Module name (celebrity, movie, timeline, etc.)
 * @param {Object} params - { page?, limit?, search?, celebrity?, moderationState?, sectionId? }
 */
export const getAllModerationItems = async (module, params = {}) => {
  try {
    const response = await httpClient.get(`/moderation/${module}/all`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching all ${module} items:`, error);
    throw error;
  }
};

/**
 * Publish/Approve an item
 * @param {string} module - Module name (celebrity, movie, timeline, etc.)
 * @param {string} itemId - Item ID
 * @param {Object} params - { sectionId? } for dynamic sections
 */
export const publishItem = async (module, itemId, params = {}) => {
  try {
    const response = await httpClient.patch(
      `/moderation/${module}/publish/${itemId}`,
      {},
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(`Error publishing ${module} item:`, error);
    throw error;
  }
};

/**
 * Reject an item
 * @param {string} module - Module name (celebrity, movie, timeline, etc.)
 * @param {string} itemId - Item ID
 * @param {Object} data - { moderationRemark?, sectionId? }
 */
export const rejectItem = async (module, itemId, data = {}) => {
  try {
    const response = await httpClient.patch(
      `/moderation/${module}/reject/${itemId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error rejecting ${module} item:`, error);
    throw error;
  }
};