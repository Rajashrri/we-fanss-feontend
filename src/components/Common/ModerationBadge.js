// src/components/Common/ModerationBadge.jsx
import React from 'react';
import { getModerationConfig } from '../../utils/moderationUtils';

const ModerationBadge = ({ state, showDot = true, style = {} }) => {
  const config = getModerationConfig(state);

  return (
    <>
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
            className="pulse-dot"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: config.color,
              display: "inline-block",
              position: "relative",
            }}
          />
        )}
        {config.text}
      </div>

      {/* ✅ Pulse Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 ${config.color}66;
          }
          50% {
            box-shadow: 0 0 0 6px ${config.color}00;
          }
          100% {
            box-shadow: 0 0 0 0 ${config.color}00;
          }
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ModerationBadge;