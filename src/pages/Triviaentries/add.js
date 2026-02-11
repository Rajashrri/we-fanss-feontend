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
import { addtriviaentries } from "../../api/triviaentriesApi";
import { getTriviaTypeOptions } from "../../api/optionsApi";
import { useNavigate, useParams } from "react-router-dom";

const AddTriviaEntries = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Add Trivia Entries", link: "#" },
  ]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [trivia, setTrivia] = useState({
    categoryId: "",
    categoryName: "",
    title: "",
    description: "",
    media: null,
    sourceLink: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const celebrityId = id;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTrivia((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit form
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!trivia.categoryId) newErrors.categoryId = "Category is required";
    if (!trivia.title?.trim()) newErrors.title = "Title is required";
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
      formData.append("celebrity", celebrityId);
      
      if (trivia.sourceLink?.trim()) {
        formData.append("sourceLink", trivia.sourceLink.trim());
      }
      
      if (trivia.media) {
        formData.append("media", trivia.media);
      }

      const res_data = await addtriviaentries(formData);

      if (res_data.success === false) {
        toast.error(res_data.message || "Failed to add Trivia Entry");
        return;
      }

      toast.success("Trivia Entry added successfully!");
      navigate(`/dashboard/fixed-sections/${celebrityId}/trivia`);
    } catch (error) {
      console.error("Add Trivia Entry Error:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch category options from centralized API
  const fetchOptions = async () => {
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
      console.error("Error fetching category options:", error);
      toast.error("Failed to load categories");
      setCategoryOptions([]);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Add Trivia Entries"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <form className="needs-validation" onSubmit={handleAddSubmit}>
                    <Row>
                      {/* Trivia Category */}
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
                            value={trivia.title || ""}
                            onChange={handleInput}
                            name="title"
                            placeholder="Enter trivia title"
                            type="text"
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
                            name="description"
                            placeholder="Enter description"
                            value={trivia.description}
                            onChange={handleInput}
                            rows="4"
                            disabled={loading}
                          />
                          {errors.description && (
                            <span className="text-danger">
                              {errors.description}
                            </span>
                          )}
                        </div>
                      </Col>

                      {/* Media (optional) */}
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
                          {trivia.media && (
                            <small className="text-success">
                              {trivia.media.name}
                            </small>
                          )}
                        </div>
                      </Col>

                      {/* Source Link (optional) */}
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            Source Link (optional)
                          </Label>
                          <Input
                            type="text"
                            name="sourceLink"
                            placeholder="Enter source link"
                            value={trivia.sourceLink}
                            onChange={handleInput}
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
                            Adding...
                          </>
                        ) : (
                          "Add Trivia Entry"
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
    </React.Fragment>
  );
};

export default AddTriviaEntries;