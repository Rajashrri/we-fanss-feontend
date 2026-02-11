import React, { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Container, Table, Row, Col, Input } from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Pencil,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getCelebraties,
  deleteCelebraty,
  updateCelebratyStatus,
} from "../../api/celebratyApi";
import { publishItem, rejectItem } from "../../api/moderationApi";
import DeleteConfirmModal from "../../components/Modals/DeleteModal";
import RejectReasonModal from "../../components/Modals/RejectReasonModal";
import PrivilegeAccess, { useResourcePermissions } from "../../components/protection/PrivilegeAccess";
import {
  PRIVILEGE_RESOURCES,
  OPERATIONS,
} from "../../constant/privilegeConstants";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col md={3}>
      <div style={{ position: "relative" }}>
        <Input
          type="text"
          className="form-control"
          placeholder="Search record..."
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          style={{
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "10px 40px 10px 16px",
          }}
        />
        <Search
          size={18}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#999",
            pointerEvents: "none",
          }}
        />
      </div>
    </Col>
  );
}

function Filter() {
  return null;
}

const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  onFilterChange,
  filters,
  permissions,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
  );

  const { pageIndex, pageSize } = state;

  if (!permissions.view) {
    return (
      <div className="text-center py-5">
        <i className="bx bx-lock-alt" style={{ fontSize: "48px", color: "#ccc" }}></i>
        <p className="mt-3" style={{ color: "#666", fontSize: "16px" }}>
          You don't have permission to view celebrities.
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <Row className="mb-3 align-items-center">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "10px 16px",
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </Col>

        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}

        <Col md={2}>
          <select
            className="form-select"
            value={filters.moderationState}
            onChange={(e) => onFilterChange("moderationState", e.target.value)}
            style={{
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "10px 16px",
            }}
          >
            <option value="">All States</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </Col>

        <Col md={2}>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
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

        {permissions.add && (
          <Col md={3}>
            <div className="d-flex justify-content-end">
              <Link
                to="/dashboard/add-celebrity"
                className="theme-btn bg-theme"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Add Celebrity
              </Link>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table
          {...getTableProps()}
          className={className}
          style={{ borderCollapse: "separate", borderSpacing: "0" }}
        >
          <thead style={{ backgroundColor: "#F5F5F5" }}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#666",
                      borderBottom: "none",
                      verticalAlign: "middle",
                    }}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="bx bx-chevron-down ms-1"></i>
                        ) : (
                          <i className="bx bx-chevron-up ms-1"></i>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        style={{
                          padding: "16px",
                          fontSize: "14px",
                          color: "#333",
                          verticalAlign: "middle",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <i className="bx bx-info-circle me-2"></i>
                  No celebrities found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {page.length > 0 && (
        <Row className="justify-content-end align-items-center mt-4">
          <Col className="col-auto">
            <div className="d-flex gap-2 align-items-center">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canPreviousPage ? "pointer" : "not-allowed",
                  opacity: canPreviousPage ? 1 : 0.5,
                }}
              >
                {"<<"}
              </button>
              <button
                onClick={previousPage}
                disabled={!canPreviousPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canPreviousPage ? "pointer" : "not-allowed",
                  opacity: canPreviousPage ? 1 : 0.5,
                }}
              >
                {"<"}
              </button>

              <select
                className="form-select"
                value={pageIndex}
                onChange={(e) => gotoPage(Number(e.target.value))}
                style={{
                  width: "140px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {pageOptions.map((pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    Page {pageNum + 1} of {pageOptions.length}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={1}
                max={pageOptions.length}
                style={{
                  width: "70px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />

              <button
                onClick={nextPage}
                disabled={!canNextPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canNextPage ? "pointer" : "not-allowed",
                  opacity: canNextPage ? 1 : 0.5,
                }}
              >
                {">"}
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canNextPage ? "pointer" : "not-allowed",
                  opacity: canNextPage ? 1 : 0.5,
                }}
              >
                {">>"}
              </button>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  customPageSize: PropTypes.number,
  className: PropTypes.string,
  isGlobalFilter: PropTypes.bool,
  onFilterChange: PropTypes.func,
  filters: PropTypes.object,
  permissions: PropTypes.object.isRequired,
};

const CelebratyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const basicPermissions = useResourcePermissions(PRIVILEGE_RESOURCES.CELEBRITY_BASIC_INFO);
  const professionPermissions = useResourcePermissions(PRIVILEGE_RESOURCES.CELEBRITY_PROFESSION_SECTIONS);
  const dynamicPermissions = useResourcePermissions(PRIVILEGE_RESOURCES.CELEBRITY_DYNAMIC_SECTIONS);
  const customPermissions = useResourcePermissions(PRIVILEGE_RESOURCES.CELEBRITY_CUSTOM_SECTIONS);

  const hasAnySectionPermission = 
    professionPermissions.view || professionPermissions.publish ||
    dynamicPermissions.view || dynamicPermissions.publish ||
    customPermissions.view || customPermissions.publish;

  const hasAnyActionPermission = 
    basicPermissions.edit || basicPermissions.delete || basicPermissions.publish;

  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectItem, setRejectItem] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [filters, setFilters] = useState({
    moderationState: searchParams.get("moderationState") || "",
    status: searchParams.get("status") || "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getModerationBadge = (state) => {
    const badges = {
      PENDING: { color: "#FFA500", text: "Pending" },
      PUBLISHED: { color: "#28a745", text: "Published" },
      REJECTED: { color: "#dc3545", text: "Rejected" },
    };

    const badge = badges[state] || badges.PENDING;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#333",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: badge.color,
            display: "inline-block",
          }}
        />
        {badge.text}
      </div>
    );
  };

  const fetchCelebrities = async () => {
    try {
      setLoading(true);
      const result = await getCelebraties(filters);
      const data = result.data || result.msg || result;

      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setCelebrities(data);
      } else {
        setCelebrities([]);
      }
    } catch (error) {
      console.error("Error fetching celebrities:", error);

      if (error.response?.status === 403) {
        console.warn("User doesn't have permission to view celebrities");
        setCelebrities([]);
      } else {
        toast.error("Failed to load celebrities.");
        setCelebrities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(newFilters);

    const params = {};
    if (newFilters.moderationState)
      params.moderationState = newFilters.moderationState;
    if (newFilters.status) params.status = newFilters.status;

    setSearchParams(params);
  };

  const handleStatusChange = async (currentStatus, id) => {
    if (isUpdatingStatus) return;

    const newStatus = Number(currentStatus) === 1 ? 0 : 1;

    try {
      setIsUpdatingStatus(true);
      
      const response = await updateCelebratyStatus(id, newStatus);
      const success = response.success;
      const message = response.message || response.msg;

      if (!success) {
        toast.error(message || "Failed to update status");
        return;
      }

      toast.success(message || "Celebrity status updated successfully");
      
      setCelebrities((prev) =>
        prev.map((celebrity) =>
          celebrity._id === id
            ? { ...celebrity, status: response.data.status }
            : celebrity
        )
      );
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again!");
      fetchCelebrities();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePublish = async (id, name) => {
    try {
      const response = await publishItem("celebrity", id);
      const success = response.success || response.status;
      const message = response.message || response.msg;

      if (!success) {
        toast.error(message || "Failed to publish celebrity");
        return;
      }

      toast.success(message || `${name} published successfully!`);
      fetchCelebrities();
    } catch (error) {
      console.error("Error publishing celebrity:", error);
      toast.error("Error publishing celebrity. Please try again!");
    }
  };

  const handleRejectClick = (celebrity) => {
    setRejectItem(celebrity);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (!rejectItem) return;

    try {
      const response = await rejectItem("celebrity", rejectItem._id, {
        moderationRemark: reason,
      });

      const success = response.success || response.status;
      const message = response.message || response.msg;

      if (!success) {
        toast.error(message || "Failed to reject celebrity");
        return;
      }

      toast.success(message || `${rejectItem.name} rejected successfully!`);
      setRejectModalOpen(false);
      setRejectItem(null);
      fetchCelebrities();
    } catch (error) {
      console.error("Error rejecting celebrity:", error);
      toast.error("Error rejecting celebrity. Please try again!");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const result = await deleteCelebraty(deleteId);
      const success = result.success || result.status;
      const message = result.message || result.msg;

      if (success) {
        toast.success(message || "Celebrity deleted successfully!");
        setCelebrities((prev) => prev.filter((row) => row._id !== deleteId));
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(message || "Failed to delete celebrity.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (basicPermissions.view || basicPermissions.publish) {
      fetchCelebrities();
    }
  }, [filters, basicPermissions.view, basicPermissions.publish]);

  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Celebrity Name",
      accessor: "name",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value}</strong>
      ),
    },
    {
      Header: "Moderation",
      accessor: "moderationState",
      Cell: ({ value }) => getModerationBadge(value),
    },
    ...(hasAnySectionPermission
      ? [
          {
            Header: "Sections",
            disableSortBy: true,
            Cell: ({ row }) => {
              const celebrity = row.original;

              return (
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {(professionPermissions.publish || professionPermissions.view) && (
                    <Link
                      to={`/dashboard/fixed-sections/${celebrity._id}/timeline`}
                      style={{
                        backgroundColor: "#F5F5F5",
                        color: "#333",
                        borderRadius: "100px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Fixed
                    </Link>
                  )}

                  {(dynamicPermissions.publish || dynamicPermissions.view) && (
                    <Link
                      to={`/dashboard/section-template-list/${celebrity._id}`}
                      style={{
                        backgroundColor: "#4285F40D",
                        color: "#4285F4",
                        borderRadius: "100px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Profession
                    </Link>
                  )}

                  {(customPermissions.publish || customPermissions.view) && (
                    <Link
                      to={`/dashboard/customoption-list/${celebrity._id}`}
                      className="theme-btn bg-theme"
                      style={{
                        color: "white",
                        borderRadius: "100px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Custom
                    </Link>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const isActive = Number(row.original.status) === 1;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${row.original._id}`}
              checked={isActive}
              onChange={() => handleStatusChange(row.original.status, row.original._id)}
              disabled={!basicPermissions.edit || isUpdatingStatus}
              style={{
                width: "48px",
                height: "24px",
                cursor: basicPermissions.edit && !isUpdatingStatus ? "pointer" : "not-allowed",
                backgroundColor: isActive ? "#4285F4" : "#ccc",
                borderColor: isActive ? "#1E90FF" : "#ccc",
                opacity: isUpdatingStatus ? 0.6 : 1,
              }}
            />
          </div>
        );
      },
    },
    ...(hasAnyActionPermission
      ? [
          {
            Header: "Options",
            disableSortBy: true,
            Cell: ({ row }) => {
              const celebrity = row.original;

              return (
                <div className="d-flex gap-2">
                  {celebrity.moderationState === "PENDING" && basicPermissions.publish && (
                    <button
                      onClick={() => handlePublish(celebrity._id, celebrity.name)}
                      style={{
                        backgroundColor: "#E8F5E9",
                        color: "#4CAF50",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Publish"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}

                  {celebrity.moderationState === "PENDING" && basicPermissions.publish && (
                    <button
                      onClick={() => handleRejectClick(celebrity)}
                      style={{
                        backgroundColor: "#FFEBEE",
                        color: "#F44336",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Reject"
                    >
                      <XCircle size={20} />
                    </button>
                  )}

                  {basicPermissions.edit && (
                    <Link
                      to={`/dashboard/update-celebrity/${celebrity._id}`}
                      className="theme-edit-btn"
                      style={{
                        backgroundColor: "#4285F41F",
                        color: "#1E90FF",
                        border: "none",
                        borderRadius: "6px",
                        width: "40px",
                        height: "40px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pencil size={20} strokeWidth="2" />
                    </Link>
                  )}

                  {basicPermissions.delete && (
                    <button
                      onClick={() => handleDeleteClick(celebrity._id)}
                      className="theme-delete-btn"
                      style={{
                        backgroundColor: "#FFE5E5",
                        color: "#FF5555",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash size={20} color="#BA2526" />
                    </button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Celebrities List"
            breadcrumbItems={breadcrumbItems}
          />

          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading celebrities...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={celebrities}
                  customPageSize={10}
                  isGlobalFilter={basicPermissions.view}
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  permissions={basicPermissions}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {basicPermissions.delete && (
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            toggle={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Delete Celebrity"
            message="This action will permanently delete all related data including movies, series, elections, positions, timeline, and trivia entries."
            confirmText="Yes, Delete"
            cancelText="Cancel"
            confirmColor="danger"
          />
        )}

        {basicPermissions.publish && (
          <RejectReasonModal
            isOpen={rejectModalOpen}
            toggle={() => setRejectModalOpen(false)}
            onConfirm={handleRejectConfirm}
            itemTitle={rejectItem?.name || ""}
          />
        )}
      </div>
    </Fragment>
  );
};

export default CelebratyList;