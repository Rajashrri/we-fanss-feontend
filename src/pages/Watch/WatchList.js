// src/pages/Watch/WatchList.jsx

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
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash, Check, X } from "lucide-react";

import { getwatchs, deleteWatch, updateWatchStatus } from "../../api/watchApi";
import { getCelebratyById } from "../../api/celebratyApi";
import { publishItem, rejectItem } from "../../api/moderationApi";

import DeleteConfirmModal from "../../components/Modals/DeleteModal";
import RejectReasonModal from "../../components/Modals/RejectReasonModal";

import ModerationFilter from "../../components/Common/ModerationFilter";
import ModerationBadge from "../../components/Common/ModerationBadge";

import { formatDate } from "../../utils/dateUtils";

// ========================================
// GLOBAL FILTER
// ========================================

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
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
// TABLE CONTAINER
// ========================================

const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  celebrityId,
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
    usePagination,
  );

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      <Row className="mb-3 align-items-center">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
              to={`/dashboard/add-watch/${celebrityId}`}
              className="theme-btn bg-theme"
              style={{
                color: "white",
                borderRadius: "8px",
                padding: "10px 16px",
                textDecoration: "none",
              }}
            >
              <Plus size={18} /> Add Watch
            </Link>
          </div>
        </Col>
      </Row>

      {/* TABLE */}

      <div className="table-responsive react-table">
        <Table {...getTableProps()} className={className}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
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
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No watch found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}

      {page.length > 0 && (
        <Row className="justify-content-end mt-4">
          <Col className="col-auto">
            <div className="d-flex gap-2">
              <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {"<<"}
              </button>

              <button onClick={previousPage} disabled={!canPreviousPage}>
                {"<"}
              </button>

              <Input
                type="number"
                min={1}
                max={pageOptions.length}
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;

                  gotoPage(page);
                }}
                style={{ width: "80px" }}
              />

              <button onClick={nextPage} disabled={!canNextPage}>
                {">"}
              </button>

              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
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

// ========================================
// MAIN COMPONENT
// ========================================

const WatchList = () => {
  const { id } = useParams();

  const [watchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [celebrityName, setCelebrityName] = useState("");

  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    published: 0,
    rejected: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    moderationState: searchParams.get("moderationState") || "",
    status: searchParams.get("status") || "",
  });

  // ========================================
  // FETCH DATA
  // ========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const result = await getwatchs(id, filters);
setWatchList(
  (result.data || []).map((item) => ({
    ...item,
    status: Number(item.status),
  }))
);
      if (result.meta?.moderationStats) {
        setModerationStats(result.meta.moderationStats);
      }
    } catch (error) {
      toast.error("Failed to load watch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCelebrityName = async () => {
    try {
      const response = await getCelebratyById(id);

      if (response.data?.identityProfile?.name) {
        setCelebrityName(response.data.identityProfile.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCelebrityName();
  }, [id, filters]);

  // ========================================
  // FILTER
  // ========================================

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(newFilters);

    const params = {};

    if (newFilters.moderationState) {
      params.moderationState = newFilters.moderationState;
    }

    if (newFilters.status) {
      params.status = newFilters.status;
    }

    setSearchParams(params);
  };

  // ========================================
  // STATUS
  // ========================================
  const handleStatusChange =
    async (
      listenId,
      currentStatus
    ) => {
      const newStatus =
        Number(currentStatus) ===
        1
          ? 0
          : 1;

      try {
        const res =
          await updateWatchStatus(
            listenId,
            newStatus
          );

        if (!res?.success) {
          toast.error(
            res?.message ||
              "Update failed"
          );

          return;
        }

        setWatchList((prev) =>
          prev.map((item) =>
            item._id ===
            listenId
              ? {
                  ...item,
                  status:
                    newStatus,
                }
              : item
          )
        );

        toast.success(
          "Status updated"
        );
      } catch (err) {
        toast.error(
          "Error updating status"
        );
      }
    };

  // ========================================
  // DELETE
  // ========================================

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteWatch(selectedItem._id);

      toast.success("Watch deleted successfully");

      setDeleteModalOpen(false);

      fetchData();
    } catch (error) {
      toast.error("Failed to delete watch");
    }
  };

  // ========================================
  // PUBLISH / REJECT
  // ========================================

  const handlePublishClick = async (item) => {
    try {
      await publishItem("watch", item._id);

      toast.success("Watch published successfully");

      fetchData();
    } catch (error) {
      toast.error("Failed to publish watch");
    }
  };

  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason) => {
    try {
      await rejectItem("watch", selectedItem._id, {
        moderationRemark: reason,
      });

      toast.success("Watch rejected successfully");

      setRejectModalOpen(false);

      fetchData();
    } catch (error) {
      toast.error("Failed to reject watch");
    }
  };

  // ========================================
  // TABLE COLUMNS
  // ========================================

  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
    },

    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },

    {
      Header: "Title",
      accessor: "title",
    },

    {
      Header: "Video Type",
      accessor: "videoType",
    },

    {
      Header: "Link",
      accessor: "link",
      Cell: ({ value }) => (
        <a href={value} target="_blank" rel="noreferrer">
          Open
        </a>
      ),
    },

    // {
    //   Header: "Moderation",
    //   accessor: "moderationState",
    //   Cell: ({ value }) => <ModerationBadge state={value} />,
    // },


  {
      Header: "Status",

      accessor: "status",

      Cell: ({ row }) => {
        const isActive =
          Number(
            row.original.status
          ) === 1;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${row.original._id}`}
              checked={isActive}
              onChange={() =>
                handleStatusChange(
                  row.original._id,
                  Number(
                    row.original
                      .status
                  )
                )
              }
              style={{
                width: "48px",
                height: "24px",
                backgroundColor:
                  isActive
                    ? "#4285F4"
                    : "#ccc",

                borderColor:
                  isActive
                    ? "#1E90FF"
                    : "#ccc",
              }}
            />
          </div>
        );
      },
    },




    {
      Header: "Options",

      Cell: ({ row }) => {
        const isPending =
          row.original.moderationState?.toLowerCase() === "pending";

        return (
          <div className="d-flex gap-2">
            {/* {isPending && (
              <button
                onClick={() => handlePublishClick(row.original)}
                className="btn btn-success btn-sm"
              >
                <Check size={16} />
              </button>
            )}

            {isPending && (
              <button
                onClick={() => handleRejectClick(row.original)}
                className="btn btn-danger btn-sm"
              >
                <X size={16} />
              </button>
            )} */}

            <Link
              to={`/dashboard/update-watch/${row.original._id}`}
              className="btn btn-primary btn-sm"
            >
              <Pencil size={16} />
            </Link>

            <button
              onClick={() => handleDeleteClick(row.original)}
              className="btn btn-danger btn-sm"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Container fluid>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                Watch List
                {celebrityName && ` — ${celebrityName}`}
              </h4>
            </div>

            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : (
              <TableContainer
                columns={columns}
                data={watchList}
                customPageSize={10}
                isGlobalFilter={true}
                celebrityId={id}
                onFilterChange={handleFilterChange}
                filters={filters}
                moderationStats={moderationStats}
              />
            )}
          </CardBody>
        </Card>
      </Container>

      {/* DELETE MODAL */}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Watch"
        message={`Delete "${selectedItem?.title}" ?`}
      />

      {/* REJECT MODAL */}

      <RejectReasonModal
        isOpen={rejectModalOpen}
        toggle={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        itemTitle={selectedItem?.title || ""}
      />
    </Fragment>
  );
};

export default WatchList;
