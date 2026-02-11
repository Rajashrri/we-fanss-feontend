// src/utils/moderationUtils.js

/**
 * Get moderation badge configuration
 * @param {string} state - PENDING | PUBLISHED | REJECTED
 * @returns {object} - { color, text, bgColor }
 */
export const getModerationConfig = (state) => {
  const configs = {
    PENDING: { 
      color: "#FFA500", 
      text: "Pending",
      bgColor: "#FFF3E0" 
    },
    PUBLISHED: { 
      color: "#28a745", 
      text: "Published",
      bgColor: "#E8F5E9" 
    },
    REJECTED: { 
      color: "#dc3545", 
      text: "Rejected",
      bgColor: "#FFEBEE" 
    },
  };

  return configs[state] || configs.PENDING;
};

/**
 * Moderation state options for dropdowns
 */
export const MODERATION_STATES = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
};

/**
 * Get all moderation states as array
 */
export const getModerationStates = () => [
  { value: "", label: "All" },
  { value: MODERATION_STATES.PENDING, label: "Pending" },
  { value: MODERATION_STATES.PUBLISHED, label: "Published" },
  { value: MODERATION_STATES.REJECTED, label: "Rejected" },
];