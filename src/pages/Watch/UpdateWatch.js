// src/pages/Watch/UpdateWatch.jsx

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

import { getWatchById, updateWatch } from "../../api/watchApi";

const UpdateWatch = () => {
  const [watch, setWatch] = useState({
    title: "",
    videoType: "",
    link: "",
    thumbnail: null,
    old_thumbnail: "",
  });

  const [errors, setErrors] = useState({});
  const [celebrityId, setCelebrityId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Update Watch", link: "#" },
  ];

  // ✅ Fetch Watch Data
  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const res_data = await getWatchById(id);

        console.log("Watch API Response:", res_data);

        const data = res_data?.data;

        if (data) {
          setWatch({
            title: data.title || "",
            videoType: data.videoType || "",
            link: data.link || "",
            old_thumbnail: data.thumbnail || "",
            thumbnail: null,
          });

          setCelebrityId(
            data?.celebrity?._id ||
            data?.celebrity ||
            ""
          );
        } else {
          toast.error("Watch data not found");
        }
      } catch (error) {
        console.error("Fetch Watch Error:", error);
        toast.error("Failed to fetch watch data");
      }
    };

    fetchWatch();
  }, [id]);

  // ✅ Input Handler
  const handleInput = (e) => {
    const { name, value } = e.target;

    setWatch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ File Handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setWatch((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // ✅ Submit Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!watch.title) {
      newErrors.title = "Title is required";
    }

    if (!watch.videoType) {
      newErrors.videoType = "Video Type is required";
    }

    if (!watch.link) {
      newErrors.link = "Video Link is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", watch.title);
      formData.append("videoType", watch.videoType);
      formData.append("link", watch.link);

      if (watch.thumbnail) {
        formData.append("thumbnail", watch.thumbnail);
      }

      const res_data = await updateWatch(id, formData);

      if (res_data?.success === false) {
        toast.error(res_data?.message || "Failed to update watch");
        return;
      }

      toast.success("Watch updated successfully!");

      navigate(`/dashboard/fixed-sections/${celebrityId}/watch`);

    } catch (error) {
      console.error("Update Watch Error:", error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Watch"
          breadcrumbItems={breadcrumbItems}
        />

        <Row>
          <Col xl="12">
            <Card>
              <CardBody>

                <form onSubmit={handleUpdateSubmit}>
                  <Row>

                    {/* Title */}
                    <Col md="6">
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
                    </Col>

                    {/* Video Type */}
                    <Col md="6">
                      <Label>Video Type</Label>

                      <Input
                        type="select"
                        name="videoType"
                        value={watch.videoType}
                        onChange={handleInput}
                      >
                        <option value="">
                          Select Video Type
                        </option>

                        <option value="YT">
                          YouTube
                        </option>

                        <option value="Vimeo">
                          Vimeo
                        </option>

                        <option value="Twitch">
                          Twitch
                        </option>
                      </Input>

                      {errors.videoType && (
                        <span className="text-danger">
                          {errors.videoType}
                        </span>
                      )}
                    </Col>

                    {/* Video Link */}
                    <Col md="6" className="mt-3">
                      <Label>Video Link</Label>

                      <Input
                        type="text"
                        name="link"
                        placeholder="Enter video URL"
                        value={watch.link}
                        onChange={handleInput}
                      />

                      {errors.link && (
                        <span className="text-danger">
                          {errors.link}
                        </span>
                      )}
                    </Col>

                    {/* Thumbnail */}
                    <Col md="6" className="mt-3">
                      <Label>Thumbnail</Label>

                      <Input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                      />

                      {watch.old_thumbnail && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/watch/${watch.old_thumbnail}`}
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
                    <Button type="submit" color="primary">
                      Update Watch
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      onClick={() =>
                        navigate(`/dashboard/fixed-sections/${celebrityId}/watch`)
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

export default UpdateWatch;