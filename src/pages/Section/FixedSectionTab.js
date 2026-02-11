// src/components/Section/FixedSectionTab.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import { getCelebrityPendingSummary } from '../../api/moderationApi';

const FixedSectionTab = () => {
  const { id } = useParams();
  const celebrityId = id;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const topLinks = [
    { title: 'Basic Info', route: `/dashboard/update-celebrity/${celebrityId}` },
    { title: 'Profession', route: `/dashboard/section-template-list/${celebrityId}` },
    { title: 'Fixed Section', route: `/dashboard/fixed-sections/${celebrityId}/timeline` },
  ];

  useEffect(() => {
    if (celebrityId) {
      fetchData();
    }
  }, [celebrityId]);

const fetchData = async () => {
  try {
    setLoading(true);
    
    const response = await getCelebrityPendingSummary(celebrityId);

    if (response.data?.tabs) {
      const routeMap = {
        'timeline': `/dashboard/fixed-sections/${celebrityId}/timeline`,
        'trivia': `/dashboard/fixed-sections/${celebrityId}/trivia`,
        'custom': `/dashboard/${celebrityId}/customs`,
        'references': `/dashboard/fixed-sections/${celebrityId}/references`,
        'related': `/dashboard/fixed-sections/${celebrityId}/related-personalities`,
        'movie': `/dashboard/fixed-sections/${celebrityId}/movies`,
        'series': `/dashboard/fixed-sections/${celebrityId}/series`,
        'election': `/dashboard/fixed-sections/${celebrityId}/elections`,
        'position': `/dashboard/fixed-sections/${celebrityId}/positions`
      };

      const tabsData = response.data.tabs.map(tab => ({
        _id: tab.key,
        title: tab.label,
        route: routeMap[tab.key],
        pendingCount: tab.pendingCount
      }));

      setSections(tabsData);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-4 align-items-center">
            <h4 className="mb-0 fs-4">Fixed Section</h4>
            <div className="d-flex gap-3">
              {topLinks.map((link, index) => (
                <Link key={index} className="text-theme" to={link.route} style={{ textDecoration: "none", fontSize: "14px", color: "#4285F4" }}>
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <small className="text-muted">
              <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">Celebrity List</Link>
              {" / Fixed Sections"}
            </small>
          </div>
        </div>

        <div className="d-flex flex-wrap border-bottom align-items-center mb-3" style={{ gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} style={{ minWidth: "200px", padding: "16px 24px" }}>
              <div className="skeleton" style={{ width: "80px", height: "16px", borderRadius: "4px", backgroundColor: "#e9ecef" }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ Pulse Animation CSS */}
      <style>{`
        @keyframes pulseDot {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.6);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 152, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
          }
        }

        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite !important;
        }
      `}</style>

      {/* ✅ Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-4 align-items-center">
          <h4 className="mb-0 fs-4">Fixed Section</h4>
          <div className="d-flex gap-3">
            {topLinks.map((link, index) => (
              <Link key={index} className="text-theme" to={link.route} style={{ textDecoration: "none", fontSize: "14px", color: "#4285F4" }}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <small className="text-muted">
            <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">Celebrity List</Link>
            {" / Fixed Sections"}
          </small>
        </div>
      </div>

      {/* ✅ Tabs using NavLink */}
      {sections.length > 0 ? (
        <div className="d-flex flex-wrap border-bottom align-items-center mb-3" style={{ gap: "8px" }}>
          {sections.map((section) => (
            <NavLink
              key={section._id}
              to={section.route}
              style={({ isActive }) => ({
                minWidth: "200px",
                padding: "16px 24px",
                cursor: "pointer",
                backgroundColor: isActive ? "#f8f9fa" : "transparent",
                borderBottom: isActive ? "3px solid #4285F4" : "3px solid transparent",
                transition: "all 0.3s ease",
                textDecoration: "none",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {({ isActive }) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <div style={{ 
                    fontWeight: isActive ? "600" : "normal", 
                    fontSize: "14px", 
                    color: isActive ? "#000" : "#6c757d" 
                  }}>
                    {section.title}
                  </div>
                  
                  {/* ✅ Simple pending count badge */}
                  {section.pendingCount > 0 && (
                    <div className="pending-badge" style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "6px", 
                      marginLeft: "8px", 
                      padding: "4px 10px", 
                      backgroundColor: "#FFF3E0", 
                      borderRadius: "12px" 
                    }}>
                      <span className="pulse-dot" style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        backgroundColor: "#FF9800",
                        display: "inline-block"
                      }} />
                      <span style={{ 
                        fontSize: "12px", 
                        fontWeight: "600", 
                        color: "#F57C00" 
                      }}>
                        {section.pendingCount}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 border-bottom mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <i className="bx bx-info-circle" style={{ fontSize: "48px", color: "#6c757d" }} />
          <p className="text-muted mt-3 mb-0">No sections available</p>
        </div>
      )}
    </>
  );
};

export default FixedSectionTab;