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
import { addMoviev } from "../../api/movievApi";
import { getLanguageOptions, getGenreOptions } from "../../api/optionsApi";
import { useNavigate, useParams } from "react-router-dom";
import FixedSectionTab from "./FixedSectionTab";

const AddMoviev = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Movie", link: "#" },
  ]);
  const navigate = useNavigate();
  const { id } = useParams();
  const celebrityId = id;

  const [genreOptions, setGenreOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    releaseDate: "",
    role: "",
    roleType: "",
    languages: [],
    director: "",
    producer: "",
    cast: "",
    notes: "",
    rating: "",
    platformRating: "",
    genre: [],
    awards: "",
    sort: "",
    moderationState: "PENDING",
    watchLinks: [],
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      // ✅ Fetch languages using options API
      const languagesData = await getLanguageOptions();
      if (languagesData.success) {
        const langOptions = languagesData.data.map((item) => ({
          value: item.id,
          label: item.label,
        }));
        setLanguageOptions(langOptions);
      }

      // ✅ Fetch genres using options API
      const genreData = await getGenreOptions();
      if (genreData.success) {
        const genreOpts = genreData.data.map((item) => ({
          value: item.id,
          label: item.label,
        }));
        setGenreOptions(genreOpts);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load form options");
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleAddWatchLink = () => {
    setFormData((prev) => ({
      ...prev,
      watchLinks: [...prev.watchLinks, { platform: "", url: "", type: "" }],
    }));
  };

  const handleRemoveWatchLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      watchLinks: prev.watchLinks.filter((_, i) => i !== index),
    }));
  };

  const handleWatchLinkChange = (index, field, value) => {
    const updated = [...formData.watchLinks];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, watchLinks: updated }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.releaseYear) newErrors.releaseYear = "Release year is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // ✅ Append fields with correct backend field names
      formDataToSend.append("title", formData.title);
      formDataToSend.append("releaseYear", formData.releaseYear);
      formDataToSend.append("releaseDate", formData.releaseDate);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("roleType", formData.roleType);
      formDataToSend.append("director", formData.director);
      formDataToSend.append("producer", formData.producer);
      formDataToSend.append("cast", formData.cast);
      formDataToSend.append("notes", formData.notes);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("platformRating", formData.platformRating);
      formDataToSend.append("awards", formData.awards);
      formDataToSend.append("sort", formData.sort);
      formDataToSend.append("moderationState", formData.moderationState);
      formDataToSend.append("celebrity", celebrityId);

      // ✅ Arrays - send as JSON strings
      formDataToSend.append("languages", JSON.stringify(formData.languages));
      formDataToSend.append("genre", JSON.stringify(formData.genre));
      formDataToSend.append("watchLinks", JSON.stringify(formData.watchLinks));

      // ✅ Image file
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      // ✅ CreatedBy
      const adminid = localStorage.getItem("adminid");
      if (adminid) {
        formDataToSend.append("createdBy", adminid);
      }

      // Call backend API
      const result = await addMoviev(formDataToSend);

      if (!result.success) {
        toast.error(result.message || result.msg || "Failed to add movie.");
        return;
      }

      toast.success("Movie added successfully!");
      navigate(`/dashboard/fixed-sections/${celebrityId}/movies`);

      // Reset form
      setFormData({
        title: "",
        releaseYear: "",
        releaseDate: "",
        role: "",
        roleType: "",
        languages: [],
        director: "",
        producer: "",
        cast: "",
        notes: "",
        rating: "",
        platformRating: "",
        genre: [],
        awards: "",
        sort: "",
        moderationState: "PENDING",
        watchLinks: [],
      });
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Add Movie Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong while adding the movie.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
       
        <Breadcrumbs title="Add Movie" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    <Col md="6" className="mb-3">
                      <Label>Title <span className="text-danger">*</span></Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="Enter movie title"
                        type="text"
                        maxLength={200}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Select Genre(s)</Label>
                      <Select
                        isMulti
                        name="genre"
                        options={genreOptions}
                        value={genreOptions.filter((opt) =>
                          formData.genre.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFormData((prev) => ({
                            ...prev,
                            genre: selectedOptions.map((opt) => opt.value),
                          }))
                        }
                        placeholder="Select genres..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Release Year <span className="text-danger">*</span></Label>
                      <Input
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleInput}
                        placeholder="e.g., 2024"
                        type="text"
                        maxLength={4}
                        pattern="\d{4}"
                      />
                      {errors.releaseYear && (
                        <span className="text-danger">{errors.releaseYear}</span>
                      )}
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Release Date</Label>
                      <Input
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInput}
                        type="date"
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Role / Character Name</Label>
                      <Input
                        name="role"
                        value={formData.role}
                        onChange={handleInput}
                        placeholder="e.g., Tony Stark"
                        type="text"
                        maxLength={100}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Role Type</Label>
                      <Input
                        type="select"
                        name="roleType"
                        onChange={handleInput}
                        value={formData.roleType}
                      >
                        <option value="">Select</option>
                        <option value="Lead">Lead</option>
                        <option value="Supporting">Supporting</option>
                        <option value="Cameo">Cameo</option>
                        <option value="Special Appearance">Special Appearance</option>
                        <option value="Voice">Voice</option>
                      </Input>
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Languages</Label>
                      <Select
                        isMulti
                        name="languages"
                        options={languageOptions}
                        value={languageOptions.filter((opt) =>
                          formData.languages.includes(opt.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFormData((prev) => ({
                            ...prev,
                            languages: selectedOptions.map((opt) => opt.value),
                          }))
                        }
                        placeholder="Choose languages..."
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Director</Label>
                      <Input
                        name="director"
                        value={formData.director}
                        onChange={handleInput}
                        placeholder="Director name"
                        type="text"
                        maxLength={200}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Producer / Production House</Label>
                      <Input
                        name="producer"
                        value={formData.producer}
                        onChange={handleInput}
                        placeholder="Producer or production house"
                        type="text"
                        maxLength={200}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Cast (Key Co-stars)</Label>
                      <Input
                        name="cast"
                        value={formData.cast}
                        onChange={handleInput}
                        placeholder="Main cast members"
                        type="text"
                        maxLength={500}
                      />
                    </Col>

                    <Col md="12" className="mb-3">
                      <Label>Synopsis / Notes</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInput}
                        placeholder="Movie synopsis or additional notes"
                        rows={4}
                        maxLength={2000}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Poster / Thumbnail</Label>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <div className="mt-2">
                          <small className="text-muted">Selected: {selectedFile.name}</small>
                        </div>
                      )}
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>IMDB Rating (0-10)</Label>
                      <Input
                        name="rating"
                        value={formData.rating}
                        onChange={handleInput}
                        placeholder="e.g., 8.5"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Your Platform Rating (0-10)</Label>
                      <Input
                        name="platformRating"
                        value={formData.platformRating}
                        onChange={handleInput}
                        placeholder="e.g., 9.0"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Awards / Nominations</Label>
                      <Input
                        name="awards"
                        value={formData.awards}
                        onChange={handleInput}
                        placeholder="Awards for this movie"
                        type="text"
                        maxLength={500}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Sort Order</Label>
                      <Input
                        name="sort"
                        value={formData.sort}
                        onChange={handleInput}
                        placeholder="e.g., 1"
                        type="number"
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Moderation Status</Label>
                      <Input
                        type="select"
                        name="moderationState"
                        onChange={handleInput}
                        value={formData.moderationState}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="REJECTED">Rejected</option>
                      </Input>
                    </Col>

                    {/* ✅ WATCH LINKS SECTION */}
                    <Col md="12" className="mt-4">
                      <h5>Watch Links</h5>
                      {formData.watchLinks.map((link, index) => (
                        <Row key={index} className="align-items-end mb-3">
                          <Col md="3">
                            <Label>Platform Name</Label>
                            <Input
                              type="text"
                              value={link.platform}
                              placeholder="e.g., Netflix"
                              onChange={(e) =>
                                handleWatchLinkChange(index, "platform", e.target.value)
                              }
                              maxLength={100}
                            />
                          </Col>
                          <Col md="5">
                            <Label>URL</Label>
                            <Input
                              type="url"
                              value={link.url}
                              placeholder="https://..."
                              onChange={(e) =>
                                handleWatchLinkChange(index, "url", e.target.value)
                              }
                              maxLength={500}
                            />
                          </Col>
                          <Col md="3">
                            <Label>Link Type</Label>
                            <Input
                              type="select"
                              value={link.type}
                              onChange={(e) =>
                                handleWatchLinkChange(index, "type", e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              <option value="OTT">OTT</option>
                              <option value="Trailer">Trailer</option>
                              <option value="Song">Song</option>
                              <option value="Clip">Clip</option>
                            </Input>
                          </Col>
                          <Col md="1">
                            <Button
                              type="button"
                              color="danger"
                              size="sm"
                              onClick={() => handleRemoveWatchLink(index)}
                            >
                              ×
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        size="sm"
                        onClick={handleAddWatchLink}
                      >
                        + Add Watch Link
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" color="primary">
                      Add Movie
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/fixed-sections/${celebrityId}/movies`)}
                    >
                      Cancel
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

export default AddMoviev;