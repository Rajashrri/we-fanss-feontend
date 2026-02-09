// src/components/Common/ModerationBadge.jsx
import React from 'react';
import { getModerationConfig } from '../../utils/moderationUtils';

const ModerationBadge = ({ state, showDot = true, style = {} }) => {
  const config = getModerationConfig(state);

  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "8px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#333",
        ...style
      }}
    >
      {showDot && (
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: config.color,
            display: "inline-block",
          }}
        />
      )}
      {config.text}
    </div>
  );
};

export default ModerationBadge;