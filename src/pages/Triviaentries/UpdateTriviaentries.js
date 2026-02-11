import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTriviaentriesById,
  updateTriviaentries,
} from "../../api/triviaentriesApi";
import { getTriviaTypeOptions } from "../../api/optionsApi";

const UpdateTriviaentries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [celebrityId, setCelebrityId] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [trivia, setTrivia] = useState({
    categoryId: "",
    categoryName: "",
    title: "",
    description: "",
    media: null,
    sourceLink: "",
    oldMedia: "",
  });

  // ✅ Fetch categories and entry data on load
  useEffect(() => {
    fetchCategories();
    fetchTriviaEntry();
  }, [id]);

  // Fetch category dropdown options
  const fetchCategories = async () => {
    try {
      const response = await getTriviaTypeOptions();
      if (response?.success && Array.isArray(response?.data)) {
        const options = response.data.map((item) => ({
          value: item.id,
          label: item.label,
        }));
        setCategoryOptions(options);
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategoryOptions([]);
    }
  };

  // Fetch trivia entry by ID
  const fetchTriviaEntry = async () => {
    try {
      const res_data = await getTriviaentriesById(id);
      
      const entry = res_data?.data || res_data?.msg;
      
      if (entry) {
        setTrivia({
          categoryId: entry.categoryId?._id || entry.categoryId || "",
          categoryName: entry.categoryName || "",
          title: entry.title || "",
          description: entry.description || "",
          sourceLink: entry.sourceLink || "",
          oldMedia: entry.media || "",
        });
        setCelebrityId(entry.celebrityId?._id || entry.celebrityId);
      } else {
        toast.error("Failed to load trivia entry");
      }
    } catch (error) {
      console.error("Error fetching trivia entry:", error);
      toast.error("Error loading trivia entry");
    }
  };

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!trivia.title?.trim()) newErrors.title = "Title is required";
    if (!trivia.categoryId) newErrors.categoryId = "Category is required";
    if (!trivia.description?.trim()) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append("categoryId", trivia.categoryId);
      formData.append("categoryName", trivia.categoryName);
      formData.append("title", trivia.title.trim());
      formData.append("description", trivia.description.trim());
      
      if (trivia.sourceLink?.trim()) {
        formData.append("sourceLink", trivia.sourceLink.trim());
      }
      
      if (trivia.media) {
        formData.append("media", trivia.media);
      }

      const res_data = await updateTriviaentries(id, formData);

      if (res_data.success === false) {
        toast.error(res_data.message || "Failed to update entry");
        return;
      }

      toast.success("Trivia Entry updated successfully!");
      navigate(`/dashboard/triviaentries-list/${celebrityId}`);
    } catch (error) {
      console.error("Update Trivia Entry Error:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Trivia Entry"
          breadcrumbItems={["Trivia Entries", "Update"]}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    {/* Category Select */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          Trivia Category <span className="text-danger">*</span>
                        </Label>
                        <Select
                          options={categoryOptions}
                          name="categoryId"
                          value={
                            categoryOptions.find(
                              (option) => option.value === trivia.categoryId
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            setTrivia((prev) => ({
                              ...prev,
                              categoryId: selectedOption?.value || "",
                              categoryName: selectedOption?.label || "",
                            }));
                            // Clear error
                            if (errors.categoryId) {
                              setErrors((prev) => ({ ...prev, categoryId: "" }));
                            }
                          }}
                          isClearable
                          placeholder="Select category..."
                          isDisabled={loading}
                        />
                        {errors.categoryId && (
                          <span className="text-danger">
                            {errors.categoryId}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Title */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          Title <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="title"
                          value={trivia.title}
                          onChange={handleInput}
                          placeholder="Enter title"
                          disabled={loading}
                        />
                        {errors.title && (
                          <span className="text-danger">{errors.title}</span>
                        )}
                      </div>
                    </Col>

                    {/* Description */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label">
                          Description <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="textarea"
                          rows="4"
                          name="description"
                          value={trivia.description}
                          onChange={handleInput}
                          placeholder="Enter description"
                          disabled={loading}
                        />
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Media */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">Media (optional)</Label>
                        <Input
                          type="file"
                          name="media"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          disabled={loading}
                        />
                        {trivia.oldMedia && (
                          <div className="mt-2">
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}/triviaentries/${trivia.oldMedia}`}
                              alt="Current Media"
                              width="120"
                              className="rounded border"
                            />
                          </div>
                        )}
                        {trivia.media && (
                          <small className="text-success d-block mt-1">
                            New file selected: {trivia.media.name}
                          </small>
                        )}
                      </div>
                    </Col>

                    {/* Source Link */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">
                          Source Link (optional)
                        </Label>
                        <Input
                          name="sourceLink"
                          value={trivia.sourceLink}
                          onChange={handleInput}
                          placeholder="Enter source link"
                          disabled={loading}
                        />
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Trivia Entry"
                      )}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(`/dashboard/triviaentries-list/${celebrityId}`)
                      }
                      disabled={loading}
                    >
                      ← Back
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateTriviaentries;