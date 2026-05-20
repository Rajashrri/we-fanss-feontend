// src/pages/Read/UpdateRead.jsx

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import {
  getReadById,
  updateRead,
} from "../../api/readApi";

const UpdateRead = () => {
  const [read, setRead] = useState({
    title: "",
    shortIntro: "",
    link: "",
    thumbnail: null,
    old_thumbnail: "",
  });

  const [errors, setErrors] = useState({});
  const [celebrityId, setCelebrityId] =
    useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Update Read", link: "#" },
  ];

  // ✅ Fetch Read Data
  useEffect(() => {
    const fetchRead = async () => {
      try {
        const res_data =
          await getReadById(id);

        console.log(
          "Read API Response:",
          res_data
        );

        const data = res_data?.data;

        if (data) {
          setRead({
            title: data.title || "",
            shortIntro:
              data.shortIntro || "",
            link: data.link || "",
            old_thumbnail:
              data.thumbnail || "",
            thumbnail: null,
          });

          setCelebrityId(
            data?.celebrity?._id ||
              data?.celebrity ||
              ""
          );
        } else {
          toast.error("Read data not found");
        }
      } catch (error) {
        console.error(
          "Fetch Read Error:",
          error
        );

        toast.error(
          "Failed to fetch read data"
        );
      }
    };

    fetchRead();
  }, [id]);

  // ✅ Input Handler
  const handleInput = (e) => {
    const { name, value } = e.target;

    setRead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ File Handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setRead((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // ✅ Submit Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!read.title) {
      newErrors.title =
        "Title is required";
    }

    if (!read.shortIntro) {
      newErrors.shortIntro =
        "Short Intro is required";
    }

    if (!read.link) {
      newErrors.link =
        "Link is required";
    }

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "title",
        read.title
      );

      formData.append(
        "shortIntro",
        read.shortIntro
      );

      formData.append(
        "link",
        read.link
      );

      if (read.thumbnail) {
        formData.append(
          "thumbnail",
          read.thumbnail
        );
      }

      const res_data =
        await updateRead(
          id,
          formData
        );

      if (
        res_data?.success === false
      ) {
        toast.error(
          res_data?.message ||
            "Failed to update read"
        );

        return;
      }

      toast.success(
        "Read updated successfully!"
      );

      navigate(
        `/dashboard/fixed-sections/${celebrityId}/read`
      );
    } catch (error) {
      console.error(
        "Update Read Error:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong!"
      );
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Read"
          breadcrumbItems={
            breadcrumbItems
          }
        />

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form
                  onSubmit={
                    handleUpdateSubmit
                  }
                >
                  <Row>
                    {/* Title */}
                    <Col md="6">
                      <Label>Title</Label>

                      <Input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={read.title}
                        onChange={
                          handleInput
                        }
                      />

                      {errors.title && (
                        <span className="text-danger">
                          {errors.title}
                        </span>
                      )}
                    </Col>

                    {/* Link */}
                    <Col md="6">
                      <Label>Link</Label>

                      <Input
                        type="text"
                        name="link"
                        placeholder="Enter link"
                        value={read.link}
                        onChange={
                          handleInput
                        }
                      />

                      {errors.link && (
                        <span className="text-danger">
                          {errors.link}
                        </span>
                      )}
                    </Col>

                    {/* Short Intro */}
                    <Col
                      md="12"
                      className="mt-3"
                    >
                      <Label>
                        Short Intro
                      </Label>

                      <Input
                        type="textarea"
                        name="shortIntro"
                        rows="5"
                        placeholder="Enter short intro"
                        value={
                          read.shortIntro
                        }
                        onChange={
                          handleInput
                        }
                      />

                      {errors.shortIntro && (
                        <span className="text-danger">
                          {
                            errors.shortIntro
                          }
                        </span>
                      )}
                    </Col>

                    {/* Thumbnail */}
                    <Col
                      md="6"
                      className="mt-3"
                    >
                      <Label>
                        Thumbnail
                      </Label>

                      <Input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={
                          handleFileChange
                        }
                      />

                      {read.old_thumbnail && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/read/${read.old_thumbnail}`}
                            alt="thumbnail"
                            width="120"
                            className="rounded border"
                          />
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      color="primary"
                    >
                      Update Read
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

export default UpdateRead;