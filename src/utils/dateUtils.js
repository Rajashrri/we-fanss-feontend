// src/utils/dateUtils.js

/**
 * Format date to DD/MM/YYYY
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format date to full format
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDateFull = (dateString) => {
  if (!dateString) return "—";
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {string} dateString 
 * @returns {string}
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return "—";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
};