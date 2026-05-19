import React, { useState } from "react";
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
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { addWatch } from "../../api/watchApi";

const AddWatch = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const celebrityId = id;

  const [watch, setWatch] = useState({
    title: "",
    thumbnail: null,
    videoType: "",
    link: "",
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Watch", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;

    setWatch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;

    setWatch((prev) => ({
      ...prev,
      thumbnail: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!watch.title) newErrors.title = "Title is required";
    if (!watch.videoType)
      newErrors.videoType = "Video type is required";
    if (!watch.link) newErrors.link = "Link is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", watch.title);
      formData.append("videoType", watch.videoType);
      formData.append("link", watch.link);
      formData.append("celebrity", celebrityId);

      if (watch.thumbnail) {
        formData.append("thumbnail", watch.thumbnail);
      }

      const response = await addWatch(formData);

      if (response?.success === true) {
        toast.success(response.message || "Watch added successfully");

        navigate(`/dashboard/fixed-sections/${celebrityId}/watch`);
      } else {
        toast.error(response?.message || "Failed to add watch");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Watch" breadcrumbItems={breadcrumbItems} />

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Row>
                    {/* Title */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Title</Label>

                        <Input
                          type="text"
                          name="title"
                          placeholder="Enter title"
                          value={watch.title}
                          onChange={handleInput}
                        />

                        {errors.title && (
                          <span className="text-danger">
                            {errors.title}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Video Type */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Video Link Type</Label>

                        <Input
                          type="select"
                          name="videoType"
                          value={watch.videoType}
                          onChange={handleInput}
                        >
                          <option value="">
                            Select Video Type
                          </option>

                          <option value="YT">YT</option>
                          <option value="Vimeo">Vimeo</option>
                          <option value="Twitch">Twitch</option>
                        </Input>

                        {errors.videoType && (
                          <span className="text-danger">
                            {errors.videoType}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Thumbnail */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Thumbnail</Label>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </Col>

                    {/* Link */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Link</Label>

                        <Input
                          type="text"
                          name="link"
                          placeholder="Enter video link"
                          value={watch.link}
                          onChange={handleInput}
                        />

                        {errors.link && (
                          <span className="text-danger">
                            {errors.link}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Add Watch
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(
                          `/dashboard/fixed-sections/${celebrityId}/watch`
                        )
                      }
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

export default AddWatch;