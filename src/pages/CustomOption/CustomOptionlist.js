// src/pages/Celebrity/CustomSectionList.jsx
import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Plus, Pen, Trash, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getcustomoption,
  deletecustomoption,
  updatecustomoptionStatus,
} from "../../api/customoptionApi";
import { publishItem, rejectItem } from "../../api/moderationApi";
import { getCelebratyById } from "../../api/celebratyApi";
import ModerationFilter from "../../components/Common/ModerationFilter";
import ModerationBadge from "../../components/Common/ModerationBadge";
import RejectReasonModal from "../../components/Modals/RejectReasonModal";
import { useResourcePermissions } from "../../components/protection/PrivilegeAccess";
import { PRIVILEGE_RESOURCES } from "../../constant/privilegeConstants";
import { formatDate } from "../../utils/dateUtils";
import deleteimg from "../../assets/images/delete.png";

const CustomSectionList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const celebrityId = id;

  // ========== PERMISSIONS ==========
  const permissions = useResourcePermissions(PRIVILEGE_RESOURCES.CELEBRITY_CUSTOM_SECTIONS);

  // ========== STATE ==========
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [celebrityName, setCelebrityName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectItem, setRejectItem] = useState(null);
  const [moderationStats, setModerationStats] = useState(null);

  const [filters, setFilters] = useState({
    moderationState: searchParams.get("moderationState") || "",
    status: searchParams.get("status") || "",
  });

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    // Don't fetch if user doesn't have view permission
    if (!permissions.view && !permissions.publish) {
      return;
    }

    try {
      setLoading(true);
      const result = await getcustomoption(celebrityId, {
        moderationState: filters.moderationState || undefined,
        status: filters.status !== "" ? filters.status : undefined,
      });

      if (result?.success && result?.data) {
        const dataArray = Array.isArray(result.data) ? result.data : [];
        setSections(dataArray);
        
        // Set moderation stats
        if (result?.meta?.moderationStats) {
          setModerationStats(result.meta.moderationStats);
        }

        // Set first section as active if exists
        if (dataArray.length > 0 && !activeSection) {
          setActiveSection(dataArray[0]);
        } else if (activeSection) {
          // Update active section if it exists in new data
          const updatedActive = dataArray.find(s => s._id === activeSection._id);
          if (updatedActive) {
            setActiveSection(updatedActive);
          } else if (dataArray.length > 0) {
            setActiveSection(dataArray[0]);
          } else {
            setActiveSection(null);
          }
        }
      } else {
        setSections([]);
        setActiveSection(null);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      
      // Show backend error message if available
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.msg || 
                          "Failed to load sections";
      toast.error(errorMessage);
      
      setSections([]);
      setActiveSection(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCelebrityName = async () => {
    try {
      const response = await getCelebratyById(celebrityId);
      const name = response?.msg?.identityProfile?.name || 
                   response?.data?.identityProfile?.name || 
                   "";
      setCelebrityName(name);
    } catch (err) {
      console.error("Error fetching celebrity:", err);
    }
  };

  useEffect(() => {
    fetchCelebrityName();
  }, [celebrityId]);

  useEffect(() => {
    if (permissions.view || permissions.publish) {
      fetchData();
    }
  }, [filters, celebrityId, permissions.view, permissions.publish]);

  // ========== FILTER HANDLERS ==========
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(newFilters);

    // Update URL params
    const params = {};
    if (newFilters.moderationState) params.moderationState = newFilters.moderationState;
    if (newFilters.status !== "") params.status = newFilters.status;

    setSearchParams(params);
  };

  // ========== STATUS HANDLERS ==========
  const handleStatusChange = async (newStatus) => {
    if (!activeSection || !permissions.edit) return;

    try {
      const response = await updatecustomoptionStatus(activeSection._id, newStatus);

      // Check backend response
      if (response?.success === false) {
        toast.error(response?.message || response?.msg || "Failed to update status");
        return;
      }

      toast.success(response?.message || response?.msg || "Status updated successfully");

      // Update state
      const updatedSections = sections.map((section) =>
        section._id === activeSection._id
          ? { ...section, status: newStatus }
          : section
      );
      setSections(updatedSections);
      setActiveSection({ ...activeSection, status: newStatus });
      setStatusDropdownOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.msg || 
                          "Error updating status";
      toast.error(errorMessage);
    }
  };

  // ========== MODERATION HANDLERS ==========
  const handlePublish = async (section) => {
    if (!permissions.publish) return;

    try {
      const response = await publishItem("customsection", section._id);

      if (response?.success === false) {
        toast.error(response?.message || response?.msg || "Failed to publish section");
        return;
      }

      toast.success(response?.message || response?.msg || `${section.title} published successfully!`);
      await fetchData();
    } catch (error) {
      console.error("Error publishing section:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.msg || 
                          "Error publishing section";
      toast.error(errorMessage);
    }
  };

  const handleRejectClick = (section) => {
    if (!permissions.publish) return;
    
    setRejectItem(section);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectItem || !permissions.publish) return;

    try {
      const response = await rejectItem("customsection", rejectItem._id, {
        moderationRemark: reason,
      });

      if (response?.success === false) {
        toast.error(response?.message || response?.msg || "Failed to reject section");
        return;
      }

      toast.success(response?.message || response?.msg || `${rejectItem.title} rejected successfully!`);
      setRejectModalOpen(false);
      setRejectItem(null);
      await fetchData();
    } catch (error) {
      console.error("Error rejecting section:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.msg || 
                          "Error rejecting section";
      toast.error(errorMessage);
    }
  };

  // ========== DELETE HANDLERS ==========
  const handleDeleteClick = (id) => {
    if (!permissions.delete) return;
    
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || !permissions.delete) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const response = await deletecustomoption(deleteId);

      if (response?.success === false) {
        toast.error(response?.message || response?.msg || "Failed to delete section");
        return;
      }

      toast.success(response?.message || response?.msg || "Section deleted successfully");
      setDeleteModalOpen(false);
      setDeleteId(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting section:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.msg || 
                          "Something went wrong while deleting";
      toast.error(errorMessage);
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ========== PERMISSION CHECKS ==========
  const canShowModerationActions = (section) => {
    return permissions.publish && section?.moderationState === "PENDING";
  };

  const toggleStatusDropdown = () => {
    if (permissions.edit) {
      setStatusDropdownOpen(!statusDropdownOpen);
    }
  };

  // ========== PERMISSION GUARD ==========
  if (!permissions.view && !permissions.add && !permissions.publish) {
    return (
      <Fragment>
        <div className="page-content">
          <Container fluid>
            <div className="text-center py-5">
              <i className="bx bx-lock-alt" style={{ fontSize: "48px", color: "#ccc" }}></i>
              <p className="mt-3" style={{ color: "#666", fontSize: "16px" }}>
                You don't have permission to view custom sections.
              </p>
            </div>
          </Container>
        </div>
      </Fragment>
    );
  }

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "/dashboard/celebrity-list" },
    { title: "Custom Sections", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container className="p-2" fluid>
          <Card style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
            <CardBody style={{ margin: "0", padding: 0 }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="flex gap-4">
                  <h4 className="mb-1 fs-4">Custom Section</h4>
                  <div className="d-flex gap-3 align-items-center">
                    <Link
                      className="text-theme"
                      to={`/dashboard/update-celebrity/${celebrityId}`}
                      style={{ textDecoration: "none", fontSize: "14px" }}
                    >
                      Basic Info
                    </Link>
                    <Link
                      className="text-theme"
                      to={`/dashboard/fixed-sections/${celebrityId}/timeline`}
                      style={{ textDecoration: "none", fontSize: "14px" }}
                    >
                      Fixed section
                    </Link>
                    <Link
                      className="text-theme"
                      to={`/dashboard/section-template-list/${celebrityId}`}
                      style={{ textDecoration: "none", fontSize: "14px" }}
                    >
                      Profession section
                    </Link>
                  </div>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">
                      Celebrity List
                    </Link>
                    {" / Custom Section"}
                  </small>
                </div>
              </div>

              {/* Filters - Only show if user has view or publish permission */}
              {(permissions.view || permissions.publish) && (
                <Row className="mb-3 align-items-center">
                  <ModerationFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    moderationStats={moderationStats}
                  />
                </Row>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading sections...</p>
                </div>
              ) : (
                <>
                  {/* Tabs Row */}
                  <div className="d-flex border-bottom align-items-center mb-3" style={{ gap: "8px" }}>
                    {sections.map((section, index) => (
                      <div
                        key={section._id}
                        onClick={() => setActiveSection(section)}
                        style={{
                          width: "200px",
                          padding: "16px 24px",
                          cursor: "pointer",
                          backgroundColor: activeSection?._id === section._id ? "#f8f9fa" : "transparent",
                          borderBottom:
                            activeSection?._id === section._id
                              ? "3px solid #4285F4"
                              : "3px solid transparent",
                          transition: "all 0.3s ease",
                          opacity: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#e9ecef",
                              color: "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: "600",
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </div>
                          <div
                            style={{
                              fontWeight: activeSection?._id === section._id ? "600" : "normal",
                              fontSize: "14px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {section.title}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Tab Button - Only show if user has add permission */}
                    {permissions.add && (
                      <div
                        onClick={() => navigate(`/dashboard/add-customoption/${celebrityId}`)}
                        className="bg-theme"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          marginLeft: "20px",
                        }}
                      >
                        <Plus size={24} color="white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  {/* Active Section Content */}
                  {activeSection && (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "16px",
                        padding: "16px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Section Header with Actions */}
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                          <h3 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "8px" }}>
                            {activeSection.title}
                          </h3>
                          {/* Moderation Badge */}
                          <ModerationBadge state={activeSection.moderationState} />
                        </div>

                        <div style={{ gap: "16px" }} className="d-flex align-items-center">
                          {/* Moderation Actions - Only show for PENDING items if user has publish permission */}
                          {canShowModerationActions(activeSection) && (
                            <>
                              <button
                                onClick={() => handlePublish(activeSection)}
                                style={{
                                  backgroundColor: "#E8F5E9",
                                  color: "#4CAF50",
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  width: "48px",
                                  height: "48px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                                title="Publish"
                              >
                                <CheckCircle size={20} />
                              </button>

                              <button
                                onClick={() => handleRejectClick(activeSection)}
                                style={{
                                  backgroundColor: "#FFEBEE",
                                  color: "#F44336",
                                  border: "none",
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  width: "48px",
                                  height: "48px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                                title="Reject"
                              >
                                <XCircle size={20} />
                              </button>
                            </>
                          )}

                          {/* Status Dropdown - Only if user has edit permission */}
                          {permissions.edit && (
                            <Dropdown isOpen={statusDropdownOpen} toggle={toggleStatusDropdown}>
                              <DropdownToggle
                                caret
                                style={{
                                  backgroundColor: "#F4FBFF",
                                  border: "none",
                                  color: activeSection.status === 1 ? "#28a745" : "#dc3545",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  width: "130px",
                                  height: "48px",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      activeSection.status === 1 ? "var(--active-color)" : "#dc3545",
                                    display: "inline-block",
                                  }}
                                ></span>
                                {activeSection.status === 1 ? "Active" : "Inactive"}
                                <ChevronDown size={16} />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => handleStatusChange(1)}>
                                  <span style={{ color: "#28a745" }}>● Active</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => handleStatusChange(0)}>
                                  <span style={{ color: "#dc3545" }}>● Inactive</span>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          )}

                          {/* Edit Button - Only if user has edit permission */}
                          {permissions.edit && (
                            <Link
                              to={`/dashboard/update-customoption/${activeSection._id}`}
                              className="bg-theme d-flex align-items-center justify-content-center"
                              style={{
                                borderRadius: "8px",
                                width: "48px",
                                height: "48px",
                              }}
                            >
                              <Pen size={22} color="white" />
                            </Link>
                          )}

                          {/* Delete Button - Only if user has delete permission */}
                          {permissions.delete && (
                            <Button
                              onClick={() => handleDeleteClick(activeSection._id)}
                              style={{
                                backgroundColor: "#BA25261F",
                                color: "#FF5555",
                                border: "none",
                                borderRadius: "8px",
                                width: "48px",
                                height: "48px",
                              }}
                            >
                              <Trash size={22} stroke="#BA2526" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Section Content */}
                      <div className="px-2">
                        <h5 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "20px" }}>
                          {activeSection.title}
                        </h5>

                        {/* Media */}
                        {activeSection.media && (
                          <div className="mb-4">
                            {activeSection.media.type === "image" ? (
                              <img
                                src={`${process.env.REACT_APP_API_BASE_URL || ""}${activeSection.media.path}`}
                                alt={activeSection.title}
                                style={{
                                  width: "100%",
                                  maxWidth: "500px",
                                  borderRadius: "8px",
                                  backgroundColor: "#d3d3d3",
                                }}
                              />
                            ) : activeSection.media.type === "video" ? (
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  maxWidth: "500px",
                                  borderRadius: "8px",
                                  backgroundColor: "#d3d3d3",
                                }}
                              >
                                <source
                                  src={`${process.env.REACT_APP_API_BASE_URL || ""}${activeSection.media.path}`}
                                  type="video/mp4"
                                />
                              </video>
                            ) : null}
                          </div>
                        )}

                        {/* Description */}
                        <div
                          style={{
                            fontSize: "15px",
                            lineHeight: "1.8",
                            color: "#333",
                          }}
                          dangerouslySetInnerHTML={{ __html: activeSection.description }}
                        />

                        {/* Created Date */}
                        {activeSection.createdAt && (
                          <div className="mt-4 text-muted" style={{ fontSize: "14px" }}>
                            Created on: {formatDate(activeSection.createdAt)}
                          </div>
                        )}

                        {/* Moderation Info */}
                        {activeSection.moderationRemark && (
                          <div
                            className="mt-3 p-3"
                            style={{
                              backgroundColor: "#FFF3CD",
                              borderRadius: "8px",
                              border: "1px solid #FFE69C",
                            }}
                          >
                            <strong>Moderation Remark:</strong>
                            <p className="mb-0 mt-1">{activeSection.moderationRemark}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty State - Only show if user has view permission */}
                  {sections.length === 0 && (permissions.view || permissions.publish) && (
                    <div className="text-center py-5">
                      <i className="bx bx-file" style={{ fontSize: "48px", color: "#ccc" }}></i>
                      <p className="text-muted mb-3 mt-3">No custom sections found</p>
                      {permissions.add && (
                        <Button
                          color="primary"
                          onClick={() => navigate(`/dashboard/add-customoption/${celebrityId}`)}
                        >
                          <Plus size={20} className="me-2" />
                          Add First Section
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Container>

        {/* Delete Confirmation Modal */}
        {permissions.delete && (
          <Modal
            isOpen={deleteModalOpen}
            toggle={handleDeleteCancel}
            centered
            contentClassName="border-0 rounded-4"
          >
            <ModalHeader toggle={handleDeleteCancel} className="border-0">
              <span className="fw-semibold">Confirm Deletion</span>
            </ModalHeader>

            <ModalBody className="px-5 pt-4 pb-3 text-center">
              <div className="d-flex justify-content-center">
                <img src={deleteimg} alt="Delete Confirmation" width="160" className="mb-4" />
              </div>

              <h4 className="fw-bold text-dark mb-3">
                Are you sure you want to delete this custom section?
              </h4>
            </ModalBody>

            <ModalFooter className="border-0 px-4 pb-4 d-flex justify-content-end gap-3">
              <Button
                onClick={handleDeleteConfirm}
                style={{
                  backgroundColor: "#ff4d6d",
                  border: "none",
                  padding: "10px 26px",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                Yes, Delete
              </Button>

              <Button
                onClick={handleDeleteCancel}
                style={{
                  backgroundColor: "#6c757d",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "12px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Reject Reason Modal */}
        {permissions.publish && (
          <RejectReasonModal
            isOpen={rejectModalOpen}
            toggle={() => setRejectModalOpen(false)}
            onConfirm={handleRejectConfirm}
            itemTitle={rejectItem?.title || ""}
          />
        )}
      </div>
    </Fragment>
  );
};

export default CustomSectionList;