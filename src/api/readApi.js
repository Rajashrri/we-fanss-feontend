import httpClient from '../config/http/httpClient';

/* ================= GET READS ================= */
export const getReads = async (id, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.moderationState) {
      params.append(
        'moderationState',
        filters.moderationState
      );
    }

    if (filters.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();

    const url = `/read/getdata/${id}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await httpClient.get(url);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch read data'
    );
  }
};

/* ================= ADD READ ================= */
export const addRead = async (formData) => {
  try {
    const response = await httpClient.post(
      '/read/addread',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to add read'
    );
  }
};

/* ================= UPDATE READ ================= */
export const updateRead = async (id, formData) => {
  try {
    const response = await httpClient.patch(
      `/read/updateread/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to update read'
    );
  }
};

/* ================= DELETE READ ================= */
export const deleteRead = async (id) => {
  try {
    const response = await httpClient.delete(
      `/read/deleteread/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to delete read'
    );
  }
};

/* ================= UPDATE READ STATUS ================= */
export const updateReadStatus = async (
  id,
  status
) => {
  try {
    const response = await httpClient.patch(
      '/read/updateStatus',
      { id, status }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to update read status'
    );
  }
};

/* ================= GET READ BY ID ================= */
export const getReadById = async (id) => {
  try {
    const response = await httpClient.get(
      `/read/getreadByid/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch read'
    );
  }
};