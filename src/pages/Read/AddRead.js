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
import { addRead } from "../../api/readApi";

const AddRead = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const celebrityId = id;

  const [read, setRead] = useState({
    title: "",
    thumbnail: null,
    shortIntro: "",
    link: "",
  });

  const [errors, setErrors] = useState({});

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Read", link: "#" },
  ];

  const handleInput = (e) => {
    const { name, value } = e.target;

    setRead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;

    setRead((prev) => ({
      ...prev,
      thumbnail: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!read.title) newErrors.title = "Title is required";

    if (!read.shortIntro)
      newErrors.shortIntro = "Short intro is required";

    if (!read.link) newErrors.link = "Link is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", read.title);
      formData.append("shortIntro", read.shortIntro);
      formData.append("link", read.link);
      formData.append("celebrity", celebrityId);

      if (read.thumbnail) {
        formData.append("thumbnail", read.thumbnail);
      }

      const response = await addRead(formData);

      if (response?.success === true) {
        toast.success(response.message || "Read added successfully");

        navigate(`/dashboard/fixed-sections/${celebrityId}/read`);
      } else {
        toast.error(response?.message || "Failed to add read");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Read" breadcrumbItems={breadcrumbItems} />

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
                          value={read.title}
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

                    {/* Short Intro */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label>Short Intro</Label>

                        <Input
                          type="textarea"
                          name="shortIntro"
                          rows="4"
                          placeholder="Enter short intro"
                          value={read.shortIntro}
                          onChange={handleInput}
                        />

                        {errors.shortIntro && (
                          <span className="text-danger">
                            {errors.shortIntro}
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
                          value={read.link}
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
                      Add Read
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(
                          `/dashboard/fixed-sections/${celebrityId}/read`
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

export default AddRead;