import httpClient from "../config/http/httpClient";

// Get custom options by celebrity ID with filters
export const getcustomoption = async (celebrityId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status !== undefined && params.status !== null) queryParams.append('status', params.status);
    if (params.moderationState) queryParams.append('moderationState', params.moderationState);
    
    const queryString = queryParams.toString();
    const url = `/custom-sections/celebrity/${celebrityId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching custom options:", error);
    throw error;
  }
};

// Add new custom option
export const addcustomoption = async (celebrityId, formData) => {
  try {
    const response = await httpClient.post(`/custom-sections/celebrity/${celebrityId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding custom option:", error);
    throw error;
  }
};

// Update custom option
export const updatecustomoption = async (id, formData) => {
  try {
    const response = await httpClient.put(`/custom-sections/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating custom option:", error);
    throw error;
  }
};

// Delete custom option
export const deletecustomoption = async (id) => {
  try {
    const response = await httpClient.delete(`/custom-sections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting custom option:", error);
    throw error;
  }
};

// Update custom option status
export const updatecustomoptionStatus = async (id, status) => {
  try {
    const response = await httpClient.patch(`/custom-sections/${id}/status`, { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating custom option status:", error);
    throw error;
  }
};

// Get custom option by ID
export const getcustomoptionById = async (id) => {
  try {
    const response = await httpClient.get(`/custom-sections/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching custom option by ID:", error);
    throw error;
  }
};