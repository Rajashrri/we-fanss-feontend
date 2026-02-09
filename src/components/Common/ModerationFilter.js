// src/components/Common/ModerationFilter.jsx
import React from 'react';
import { Col } from 'reactstrap';
import { getModerationStates } from '../../utils/moderationUtils';

const ModerationFilter = ({ 
  filters, 
  onFilterChange, 
  moderationStats 
}) => {
  const moderationStates = getModerationStates();

  return (
    <>
      {/* Moderation State Filter */}
      <Col md={2}>
        <select
          className="form-select"
          value={filters.moderationState || ''}
          onChange={(e) => onFilterChange('moderationState', e.target.value)}
          style={{
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "10px 16px",
          }}
        >
          {moderationStates.map((state, index) => {
            let label = state.label;
            
            // Add count to label
            if (state.value === 'PENDING' && moderationStats?.pending) {
              label += ` (${moderationStats.pending})`;
            } else if (state.value === 'PUBLISHED' && moderationStats?.published) {
              label += ` (${moderationStats.published})`;
            } else if (state.value === 'REJECTED' && moderationStats?.rejected) {
              label += ` (${moderationStats.rejected})`;
            }
            
            return (
              <option key={index} value={state.value}>
                {label}
              </option>
            );
          })}
        </select>
      </Col>

      {/* Status Filter */}
      <Col md={2}>
        <select
          className="form-select"
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          style={{
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "10px 16px",
          }}
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </Col>
    </>
  );
};

export default ModerationFilter;