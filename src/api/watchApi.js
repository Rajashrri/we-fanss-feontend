// src/api/watchApi.js

import httpClient from '../config/http/httpClient';

/* ================= GET WATCHES ================= */
export const getwatchs = async (id, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.moderationState) {
      params.append('moderationState', filters.moderationState);
    }

    if (filters.status) {
      params.append('status', filters.status);
    }

    const queryString = params.toString();

    const url = `/watch/getdata/${id}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await httpClient.get(url);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch watch data'
    );
  }
};

/* ================= ADD WATCH ================= */
export const addWatch = async (formData) => {
  try {
    const response = await httpClient.post(
      '/watch/addwatch',
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
        'Failed to add watch'
    );
  }
};

/* ================= UPDATE WATCH ================= */
export const updateWatch = async (id, formData) => {
  try {
    const response = await httpClient.patch(
      `/watch/updatewatch/${id}`,
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
        'Failed to update watch'
    );
  }
};

/* ================= DELETE WATCH ================= */
export const deleteWatch = async (id) => {
  try {
    const response = await httpClient.delete(
      `/watch/deletewatch/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to delete watch'
    );
  }
};

/* ================= UPDATE WATCH STATUS ================= */
export const updateWatchStatus = async (id, status) => {
  try {
    const response = await httpClient.patch(
      '/watch/updateStatus',
      { id, status }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to update watch status'
    );
  }
};

/* ================= GET WATCH BY ID ================= */
export const getWatchById = async (id) => {
  try {
    const response = await httpClient.get(
      `/watch/getwatchByid/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch watch'
    );
  }
};