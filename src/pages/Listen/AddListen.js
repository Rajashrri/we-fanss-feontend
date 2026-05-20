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
import { addListen } from "../../api/listenApi";

const AddListen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const celebrityId = id;

  const [listen, setListen] = useState({
    title: "",
    thumbnail: null,
    videoLink: "",
    noOfHours: "",
    link: "",
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Listen", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;

    setListen((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;

    setListen((prev) => ({
      ...prev,
      thumbnail: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!listen.title) newErrors.title = "Title is required";

    if (!listen.videoLink)
      newErrors.videoLink = "Video link type is required";

    if (!listen.noOfHours)
      newErrors.noOfHours = "No. of hours is required";

    if (!listen.link) newErrors.link = "Link is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", listen.title);
      formData.append("videoLink", listen.videoLink);
      formData.append("noOfHours", listen.noOfHours);
      formData.append("link", listen.link);
      formData.append("celebrity", celebrityId);

      if (listen.thumbnail) {
        formData.append("thumbnail", listen.thumbnail);
      }

      const response = await addListen(formData);

      if (response?.success === true) {
        toast.success(response.message || "Listen added successfully");

        navigate(`/dashboard/fixed-sections/${celebrityId}/listen`);
      } else {
        toast.error(response?.message || "Failed to add listen");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Listen" breadcrumbItems={breadcrumbItems} />

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
                          value={listen.title}
                          onChange={handleInput}
                        />

                        {errors.title && (
                          <span className="text-danger">
                            {errors.title}
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

                    {/* Video Link Select */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Video Link</Label>

                        <Input
                          type="select"
                          name="videoLink"
                          value={listen.videoLink}
                          onChange={handleInput}
                        >
                          <option value="">Select Platform</option>
                          <option value="YT Music">YT Music</option>
                          <option value="Spotify">Spotify</option>
                          <option value="iTunes">iTunes</option>
                        </Input>

                        {errors.videoLink && (
                          <span className="text-danger">
                            {errors.videoLink}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* No. of Hours */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>No. of Hours</Label>

                        <Input
                          type="number"
                          name="noOfHours"
                          placeholder="Enter no. of hours"
                          value={listen.noOfHours}
                          onChange={handleInput}
                        />

                        {errors.noOfHours && (
                          <span className="text-danger">
                            {errors.noOfHours}
                          </span>
                        )}
                      </div>
                    </Col>

                    {/* Link */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label>Link</Label>

                        <Input
                          type="text"
                          name="link"
                          placeholder="Enter link"
                          value={listen.link}
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
                      Add Listen
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(
                          `/dashboard/fixed-sections/${celebrityId}/listen`
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

export default AddListen;