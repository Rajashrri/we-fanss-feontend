import httpClient from '../config/http/httpClient';

/* ================= GET LISTENS ================= */
export const getListens = async (
  id,
  filters = {}
) => {
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

    const url = `/listen/getdata/${id}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await httpClient.get(url);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch listen data'
    );
  }
};

/* ================= ADD LISTEN ================= */
export const addListen = async (formData) => {
  try {
    const response = await httpClient.post(
      '/listen/addlisten',
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
        'Failed to add listen'
    );
  }
};

/* ================= UPDATE LISTEN ================= */
export const updateListen = async (
  id,
  formData
) => {
  try {
    const response = await httpClient.patch(
      `/listen/updatelisten/${id}`,
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
        'Failed to update listen'
    );
  }
};

/* ================= DELETE LISTEN ================= */
export const deleteListen = async (id) => {
  try {
    const response = await httpClient.delete(
      `/listen/deletelisten/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to delete listen'
    );
  }
};

/* ================= UPDATE LISTEN STATUS ================= */
export const updateListenStatus = async (
  id,
  status
) => {
  try {
    const response = await httpClient.patch(
      '/listen/updateStatus',
      { id, status }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to update listen status'
    );
  }
};

/* ================= GET LISTEN BY ID ================= */
export const getListenById = async (id) => {
  try {
    const response = await httpClient.get(
      `/listen/getlistenByid/${id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch listen'
    );
  }
};