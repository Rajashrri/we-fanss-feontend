// src/pages/TriviaEntries/TriviaEntriesList.jsx
import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
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
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash, Check, X } from "lucide-react";
import {
  getTriviaentries,
  updateTriviaentriesStatus,
  deleteTriviaentries,
} from "../../api/triviaentriesApi";
import { getCelebratyById } from "../../api/celebratyApi";
import { getTriviaTypeOptions } from "../../api/optionsApi";
import { publishItem, rejectItem } from "../../api/moderationApi";
import DeleteConfirmModal from "../../components/Modals/DeleteModal";
import RejectReasonModal from "../../components/Modals/RejectReasonModal";
import ModerationFilter from "../../components/Common/ModerationFilter";
import ModerationBadge from "../../components/Common/ModerationBadge";
import { formatDate } from "../../utils/dateUtils";

// ========================================
// GLOBAL FILTER COMPONENT
// ========================================
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows?.length || 0;
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

// ========================================
// TABLE CONTAINER COMPONENT
// ========================================
const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  celebrity,
  onFilterChange,
  filters,
  moderationStats,
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
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      {/* HEADER ROW - Page Size, Search, Filters, Add Button */}
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

        <ModerationFilter 
          filters={filters}
          onFilterChange={onFilterChange}
          moderationStats={moderationStats}
        />

        <Col md={3}>
          <div className="d-flex justify-content-end">
            <Link
              to={`/dashboard/add-triviaentries/${celebrity}`}
              className="theme-btn bg-theme"
              style={{
                color: "white",
                borderRadius: "8px",
                padding: "10px 16px",
                border: "none",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              <Plus size={20} />
              Add Trivia Entry
            </Link>
          </div>
        </Col>
      </Row>

      {/* TABLE */}
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
                  No trivia entries found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
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
  celebrity: PropTypes.string,
  onFilterChange: PropTypes.func,
  filters: PropTypes.object,
  moderationStats: PropTypes.object,
};

// ========================================
// MAIN TRIVIA ENTRIES LIST COMPONENT
// ========================================
const TriviaentriesList = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ========== STATE ==========
  const [entries, setEntries] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [celebrityName, setCelebrityName] = useState("");
  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    published: 0,
    rejected: 0,
  });

  const [filters, setFilters] = useState({
    moderationState: searchParams.get('moderationState') || '',
    status: searchParams.get('status') || '',
  });

  // ========== API CALLS ==========
  const fetchCategories = async () => {
    try {
      const response = await getTriviaTypeOptions();
      
      if (response?.success && Array.isArray(response?.data)) {
        const categoryData = response.data.reduce((acc, item) => {
          if (item?.id && item?.label) {
            acc[item.id] = item.label;
          }
          return acc;
        }, {});
        setCategoryMap(categoryData);
      } else {
        setCategoryMap({});
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategoryMap({});
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getTriviaentries(id, filters);
      
      const dataArray = result?.data || [];
      setEntries(Array.isArray(dataArray) ? dataArray : []);
      
      if (result?.meta?.moderationStats) {
        setModerationStats(result.meta.moderationStats);
      }
    } catch (error) {
      console.error("Error fetching trivia entries:", error);
      toast.error("Failed to load trivia entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCelebrityName = async () => {
    try {
      const response = await getCelebratyById(id);
      if (response?.data?.identityProfile?.name) {
        setCelebrityName(response.data.identityProfile.name);
      }
    } catch (err) {
      console.error("Error fetching celebrity:", err);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    
    setFilters(newFilters);
    
    const params = {};
    if (newFilters.moderationState) params.moderationState = newFilters.moderationState;
    if (newFilters.status) params.status = newFilters.status;
    
    setSearchParams(params);
  };

  const handleStatusChange = async (currentStatus, entryId) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const res_data = await updateTriviaentriesStatus(entryId, newStatus);

      if (res_data?.success === false) {
        toast.error(res_data?.message || "Failed to update status");
        return;
      }

      toast.success("Status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again!");
    }
  };

  // ✅ PUBLISH BUTTON CLICK
  const handlePublishClick = async (item) => {
    if (!item) return;

    try {
      const response = await publishItem("trivia", item._id);

      if (response.success === false) {
        toast.error(response.message || "Failed to publish trivia entry");
        return;
      }

      toast.success("Trivia entry published successfully");
      fetchData();
    } catch (error) {
      console.error("Error publishing trivia entry:", error);
      toast.error("Error publishing trivia entry. Please try again!");
    }
  };

  // ✅ REJECT BUTTON CLICK - Open modal
  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setRejectModalOpen(true);
  };

  // ✅ REJECT CONFIRM WITH REASON
  const handleRejectConfirm = async (reason) => {
    if (!selectedItem) return;

    try {
      const response = await rejectItem("trivia", selectedItem._id, {
        moderationRemark: reason
      });

      if (response.success === false) {
        toast.error(response.message || "Failed to reject trivia entry");
        return;
      }

      toast.success("Trivia entry rejected successfully");
      fetchData();
      setRejectModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error rejecting trivia entry:", error);
      toast.error("Error rejecting trivia entry. Please try again!");
    }
  };

  // ✅ DELETE BUTTON CLICK
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      setActionLoading(true);
      const data = await deleteTriviaentries(selectedItem._id);

      if (data?.success === false) {
        toast.error(data?.message || "Failed to delete entry");
        return;
      }

      toast.success("Trivia entry deleted successfully");
      setEntries((prev) => prev.filter((row) => row?._id !== selectedItem._id));
      setDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setSelectedItem(null);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    if (id) {
      fetchData();
      fetchCategories();
      fetchCelebrityName();
    }
  }, [id, filters]);

  // ========== TABLE COLUMNS ==========
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
      Header: "Title",
      accessor: "title",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value || "—"}</strong>
      ),
    },
    {
      Header: "Category",
      accessor: "categoryId",
      Cell: ({ row }) => {
        const categoryId = row?.original?.categoryId?._id || row?.original?.categoryId;
        return categoryMap[categoryId] || row?.original?.categoryName || "N/A";
      },
    },
    {
      Header: "Moderation",
      accessor: "moderationState",
      Cell: ({ value }) => <ModerationBadge state={value} />,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const isActive = row?.original?.status == 1;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${row?.original?._id}`}
              checked={isActive}
              onChange={() =>
                handleStatusChange(row?.original?.status, row?.original?._id)
              }
              style={{
                width: "48px",
                height: "24px",
                cursor: "pointer",
                backgroundColor: isActive ? "#4285F4" : "#ccc",
                borderColor: isActive ? "#1E90FF" : "#ccc",
              }}
            />
          </div>
        );
      },
    },
    {
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => {
        const isPending = row?.original?.moderationState?.toLowerCase() === 'pending';

        return (
          <div className="d-flex gap-2">
            {/* PUBLISH BUTTON */}
            {isPending && (
              <button
                onClick={() => handlePublishClick(row.original)}
                title="Publish"
                style={{
                  backgroundColor: "#D4EDDA",
                  color: "#22C55E",
                  border: "none",
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Check size={20} strokeWidth="2" />
              </button>
            )}

            {/* REJECT BUTTON */}
            {isPending && (
              <button
                onClick={() => handleRejectClick(row.original)}
                title="Reject"
                style={{
                  backgroundColor: "#FFE5E5",
                  color: "#EF4444",
                  border: "none",
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={20} strokeWidth="2" />
              </button>
            )}

            {/* EDIT BUTTON */}
            <Link
              to={`/dashboard/update-triviaentries/${row?.original?._id}`}
              title="Edit"
              style={{
                backgroundColor: "#4285F41F",
                color: "#1E90FF",
                border: "none",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <Pencil size={20} strokeWidth="2" />
            </Link>

            {/* DELETE BUTTON */}
            <Button
              onClick={() => handleDeleteClick(row?.original)}
              title="Delete"
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
              }}
            >
              <Trash size={20} color="#BA2526" />
            </Button>
          </div>
        );
      },
    },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <Container fluid>
        <Card
          style={{
            border: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderRadius: "12px",
          }}
        >
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0" style={{ fontSize: "24px", fontWeight: "500" }}>
                Trivia Entries List
                {celebrityName && (
                  <span style={{ color: "#999", fontWeight: "400", marginLeft: "8px" }}>
                    — {celebrityName}
                  </span>
                )}
              </h4>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading trivia entries...</p>
              </div>
            ) : (
              <TableContainer
                columns={columns}
                data={entries}
                customPageSize={10}
                isGlobalFilter={true}
                celebrity={id}
                onFilterChange={handleFilterChange}
                filters={filters}
                moderationStats={moderationStats}
              />
            )}
          </CardBody>
        </Card>
      </Container>

      {/* ========== DELETE CONFIRMATION MODAL ========== */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        toggle={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Trivia Entry"
        message={`Are you sure you want to delete "${selectedItem?.title || 'this trivia entry'}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="danger"
        loading={actionLoading}
      />

      {/* ========== REJECT REASON MODAL ========== */}
      <RejectReasonModal
        isOpen={rejectModalOpen}
        toggle={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        itemTitle={selectedItem?.title || ''}
      />
    </Fragment>
  );
};

export default TriviaentriesList;