import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Badge,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Button,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { ArrowLeft, FileText, Calendar, Award, CheckCircle, XCircle } from "lucide-react";
import {
  getCelebrityPendingSummary,
  getPendingItems,
  publishItem,
  rejectItem,
} from "../../api/moderationApi";

const CelebrityPendingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pendingSummary, setPendingSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [tabData, setTabData] = useState({});
  const [tabLoading, setTabLoading] = useState({});

  // ========== MODULE DISPLAY CONFIG ==========
  const moduleConfig = {
    celebrity: { label: "Basic Info", icon: FileText, color: "#4285F4" },
    timeline: { label: "Timeline", icon: Calendar, color: "#34A853" },
    trivia: { label: "Trivia", icon: Award, color: "#FBBC04" },
    movie: { label: "Movies", icon: FileText, color: "#EA4335" },
    series: { label: "Series", icon: FileText, color: "#9C27B0" },
    election: { label: "Elections", icon: FileText, color: "#FF9800" },
    position: { label: "Positions", icon: FileText, color: "#795548" },
    reference: { label: "References", icon: FileText, color: "#607D8B" },
    relation: { label: "Relations", icon: FileText, color: "#E91E63" },
    customOption: { label: "Custom Options", icon: FileText, color: "#00BCD4" },
  };

  // ========== API CALL - PENDING SUMMARY ==========
  const fetchPendingSummary = async () => {
    setLoading(true);
    try {
      const result = await getCelebrityPendingSummary(id);
      setPendingSummary(result?.data || null);

      // Set first tab with pending count > 0 as active
      if (result?.data?.pendingCounts) {
        const firstActiveModule = Object.entries(result.data.pendingCounts).find(
          ([_, count]) => count > 0
        );
        if (firstActiveModule) {
          setActiveTab(firstActiveModule[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching pending summary:", error);
      toast.error(error?.response?.data?.message || "Failed to load pending summary");
    } finally {
      setLoading(false);
    }
  };

  // ========== API CALL - PENDING ITEMS FOR MODULE ==========
  const fetchPendingItemsForTab = async (moduleName) => {
    setTabLoading((prev) => ({ ...prev, [moduleName]: true }));
    try {
      const result = await getPendingItems(moduleName, {
        celebrity: id,
        page: 1,
        limit: 100,
      });
      setTabData((prev) => ({
        ...prev,
        [moduleName]: result?.data || [],
      }));
    } catch (error) {
      console.error(`Error fetching pending ${moduleName} items:`, error);
      toast.error(`Failed to load ${moduleName} items`);
      setTabData((prev) => ({ ...prev, [moduleName]: [] }));
    } finally {
      setTabLoading((prev) => ({ ...prev, [moduleName]: false }));
    }
  };

  // ========== HANDLERS ==========
  const handleBackClick = () => {
    navigate("/moderation/celebrities");
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      // Fetch data for this tab if not already loaded
      if (!tabData[tab]) {
        fetchPendingItemsForTab(tab);
      }
    }
  };

  const handlePublish = async (moduleName, itemId) => {
    try {
      await publishItem(moduleName, itemId);
      toast.success("Item published successfully!");
      // Refresh the tab data and summary
      fetchPendingItemsForTab(moduleName);
      fetchPendingSummary();
    } catch (error) {
      console.error("Error publishing item:", error);
      toast.error(error?.response?.data?.message || "Failed to publish item");
    }
  };

  const handleReject = async (moduleName, itemId) => {
    const reason = window.prompt("Enter rejection reason (optional):");
    try {
      await rejectItem(moduleName, itemId, {
        moderationRemark: reason || undefined,
      });
      toast.success("Item rejected!");
      // Refresh the tab data and summary
      fetchPendingItemsForTab(moduleName);
      fetchPendingSummary();
    } catch (error) {
      console.error("Error rejecting item:", error);
      toast.error(error?.response?.data?.message || "Failed to reject item");
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    if (id) {
      fetchPendingSummary();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab && !tabData[activeTab]) {
      fetchPendingItemsForTab(activeTab);
    }
  }, [activeTab]);

  // ========== CALCULATE TOTAL PENDING ==========
  const totalPending = pendingSummary?.pendingCounts
    ? Object.values(pendingSummary.pendingCounts).reduce((sum, count) => sum + count, 0)
    : 0;

  // ========== RENDER ITEM BASED ON MODULE ==========
  const renderItemDetails = (item, moduleName) => {
    switch (moduleName) {
      case "celebrity":
        return (
          <div>
            <strong>{item.name || "N/A"}</strong>
            <div className="text-muted small">
              {item.professions?.map((p) => p.name).join(", ") || "No professions"}
            </div>
          </div>
        );
      case "movie":
      case "series":
        return (
          <div>
            <strong>{item.title || item.name || "N/A"}</strong>
            <div className="text-muted small">
              {item.releaseDate ? new Date(item.releaseDate).getFullYear() : "N/A"}
            </div>
          </div>
        );
      case "timeline":
        return (
          <div>
            <strong>{item.title || "N/A"}</strong>
            <div className="text-muted small">{item.date || "N/A"}</div>
          </div>
        );
      case "trivia":
        return (
          <div>
            <div className="text-truncate" style={{ maxWidth: "400px" }}>
              {item.content || item.text || "N/A"}
            </div>
          </div>
        );
      default:
        return (
          <div>
            <strong>{item.title || item.name || item._id}</strong>
          </div>
        );
    }
  };

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Moderation", link: "#" },
    { title: "Celebrities", link: "/moderation/celebrities" },
    { title: "Pending Details", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Celebrity Pending Details"
            breadcrumbItems={breadcrumbItems}
          />

          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="mb-3"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "8px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} />
            Back to List
          </button>

          {loading ? (
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading pending summary...</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* Summary Header */}
              <Card className="mb-4">
                <CardBody>
                  <Row className="align-items-center">
                    <Col md={6}>
                      <h5 className="mb-0">Pending Items Overview</h5>
                    </Col>
                    <Col md={6} className="text-end">
                      <Badge color="warning" pill style={{ fontSize: "16px", padding: "8px 16px" }}>
                        Total: {totalPending}
                      </Badge>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Tabs */}
              {totalPending === 0 ? (
                <Alert color="info">
                  <i className="bx bx-info-circle me-2"></i>
                  No pending items found for this celebrity.
                </Alert>
              ) : (
                <Card>
                  <CardBody>
                    <Nav tabs>
                      {pendingSummary?.pendingCounts &&
                        Object.entries(pendingSummary.pendingCounts)
                          .filter(([_, count]) => count > 0)
                          .map(([moduleName, count]) => {
                            const config = moduleConfig[moduleName] || {
                              label: moduleName,
                              icon: FileText,
                              color: "#666",
                            };

                            return (
                              <NavItem key={moduleName}>
                                <NavLink
                                  className={activeTab === moduleName ? "active" : ""}
                                  onClick={() => toggleTab(moduleName)}
                                  style={{
                                    cursor: "pointer",
                                    borderBottom: activeTab === moduleName ? `3px solid ${config.color}` : "none",
                                    color: activeTab === moduleName ? config.color : "#666",
                                    fontWeight: activeTab === moduleName ? "600" : "400",
                                  }}
                                >
                                  {config.label}{" "}
                                  <Badge
                                    color={activeTab === moduleName ? "primary" : "secondary"}
                                    pill
                                    style={{ marginLeft: "6px" }}
                                  >
                                    {count}
                                  </Badge>
                                </NavLink>
                              </NavItem>
                            );
                          })}
                    </Nav>

                    <TabContent activeTab={activeTab} className="mt-3">
                      {pendingSummary?.pendingCounts &&
                        Object.entries(pendingSummary.pendingCounts)
                          .filter(([_, count]) => count > 0)
                          .map(([moduleName]) => (
                            <TabPane tabId={moduleName} key={moduleName}>
                              {tabLoading[moduleName] ? (
                                <div className="text-center py-5">
                                  <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  <p className="mt-2">Loading {moduleConfig[moduleName]?.label || moduleName}...</p>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <Table hover>
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                      <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Details</th>
                                        <th style={{ width: "120px" }}>Status</th>
                                        <th style={{ width: "150px" }}>Created</th>
                                        <th style={{ width: "200px" }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tabData[moduleName] && tabData[moduleName].length > 0 ? (
                                        tabData[moduleName].map((item, index) => (
                                          <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{renderItemDetails(item, moduleName)}</td>
                                            <td>
                                              <Badge color="warning" pill>
                                                Pending
                                              </Badge>
                                            </td>
                                            <td className="text-muted small">
                                              {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString("en-GB")
                                                : "N/A"}
                                            </td>
                                            <td>
                                              <div className="d-flex gap-2">
                                                <Button
                                                  color="success"
                                                  size="sm"
                                                  onClick={() => handlePublish(moduleName, item._id)}
                                                  style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                  }}
                                                >
                                                  <CheckCircle size={14} />
                                                  Publish
                                                </Button>
                                                <Button
                                                  color="danger"
                                                  size="sm"
                                                  onClick={() => handleReject(moduleName, item._id)}
                                                  style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                  }}
                                                >
                                                  <XCircle size={14} />
                                                  Reject
                                                </Button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan="5" className="text-center py-4">
                                            <i className="bx bx-info-circle me-2"></i>
                                            No pending items found
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              )}
                            </TabPane>
                          ))}
                    </TabContent>
                  </CardBody>
                </Card>
              )}
            </>
          )}
        </Container>
      </div>
    </Fragment>
  );
};

export default CelebrityPendingDetails;