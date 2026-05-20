// src/pages/Listen/UpdateListen.jsx

import React, {
  useState,
  useEffect,
} from "react";

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

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  getListenById,
  updateListen,
} from "../../api/listenApi";

const UpdateListen = () => {
  const [listen, setListen] =
    useState({
      title: "",
      videoLink: "",
      noOfHours: "",
      link: "",
      thumbnail: null,
      old_thumbnail: "",
    });

  const [errors, setErrors] =
    useState({});

  const [celebrityId, setCelebrityId] =
    useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      title: "Dashboard",
      link: "#",
    },
    {
      title: "Update Listen",
      link: "#",
    },
  ];

  /* ================= FETCH LISTEN ================= */

  useEffect(() => {
    const fetchListen =
      async () => {
        try {
          const res_data =
            await getListenById(id);

          console.log(
            "Listen API Response:",
            res_data
          );

          const data =
            res_data?.data;

          if (data) {
            setListen({
              title:
                data.title || "",

              videoLink:
                data.videoLink ||
                "",

              noOfHours:
                data.noOfHours ||
                "",

              link:
                data.link || "",

              old_thumbnail:
                data.thumbnail ||
                "",

              thumbnail: null,
            });

            setCelebrityId(
              data?.celebrity?._id ||
                data?.celebrity ||
                ""
            );
          } else {
            toast.error(
              "Listen data not found"
            );
          }
        } catch (error) {
          console.error(
            "Fetch Listen Error:",
            error
          );

          toast.error(
            "Failed to fetch listen data"
          );
        }
      };

    fetchListen();
  }, [id]);

  /* ================= INPUT HANDLER ================= */

  const handleInput = (e) => {
    const { name, value } =
      e.target;

    setListen((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= FILE HANDLER ================= */

  const handleFileChange = (
    e
  ) => {
    const { name, files } =
      e.target;

    setListen((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  /* ================= UPDATE SUBMIT ================= */

  const handleUpdateSubmit =
    async (e) => {
      e.preventDefault();

      const newErrors = {};

      if (!listen.title) {
        newErrors.title =
          "Title is required";
      }

      if (!listen.videoLink) {
        newErrors.videoLink =
          "Video Link is required";
      }

      if (!listen.noOfHours) {
        newErrors.noOfHours =
          "No. of Hours is required";
      }

      if (!listen.link) {
        newErrors.link =
          "Link is required";
      }

      if (
        Object.keys(newErrors)
          .length > 0
      ) {
        setErrors(newErrors);

        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "title",
          listen.title
        );

        formData.append(
          "videoLink",
          listen.videoLink
        );

        formData.append(
          "noOfHours",
          listen.noOfHours
        );

        formData.append(
          "link",
          listen.link
        );

        if (
          listen.thumbnail
        ) {
          formData.append(
            "thumbnail",
            listen.thumbnail
          );
        }

        const res_data =
          await updateListen(
            id,
            formData
          );

        if (
          res_data?.success ===
          false
        ) {
          toast.error(
            res_data?.message ||
              "Failed to update listen"
          );

          return;
        }

        toast.success(
          "Listen updated successfully!"
        );

        navigate(
          `/dashboard/fixed-sections/${celebrityId}/listen`
        );
      } catch (error) {
        console.error(
          "Update Listen Error:",
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
          title="Update Listen"
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
                    {/* TITLE */}
                    <Col md="6">
                      <Label>
                        Title
                      </Label>

                      <Input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={
                          listen.title
                        }
                        onChange={
                          handleInput
                        }
                      />

                      {errors.title && (
                        <span className="text-danger">
                          {
                            errors.title
                          }
                        </span>
                      )}
                    </Col>

                    {/* VIDEO LINK */}
                    <Col md="6">
                      <Label>
                        Video Link
                      </Label>

                      <Input
                        type="select"
                        name="videoLink"
                        value={
                          listen.videoLink
                        }
                        onChange={
                          handleInput
                        }
                      >
                        <option value="">
                          Select Platform
                        </option>

                        <option value="YT Music">
                          YT Music
                        </option>

                        <option value="Spotify">
                          Spotify
                        </option>

                        <option value="iTunes">
                          iTunes
                        </option>
                      </Input>

                      {errors.videoLink && (
                        <span className="text-danger">
                          {
                            errors.videoLink
                          }
                        </span>
                      )}
                    </Col>

                    {/* NO OF HOURS */}
                    <Col
                      md="6"
                      className="mt-3"
                    >
                      <Label>
                        No. of Hours
                      </Label>

                      <Input
                        type="number"
                        name="noOfHours"
                        placeholder="Enter no. of hours"
                        value={
                          listen.noOfHours
                        }
                        onChange={
                          handleInput
                        }
                      />

                      {errors.noOfHours && (
                        <span className="text-danger">
                          {
                            errors.noOfHours
                          }
                        </span>
                      )}
                    </Col>

                    {/* LINK */}
                    <Col
                      md="6"
                      className="mt-3"
                    >
                      <Label>
                        Link
                      </Label>

                      <Input
                        type="text"
                        name="link"
                        placeholder="Enter link"
                        value={
                          listen.link
                        }
                        onChange={
                          handleInput
                        }
                      />

                      {errors.link && (
                        <span className="text-danger">
                          {
                            errors.link
                          }
                        </span>
                      )}
                    </Col>

                    {/* THUMBNAIL */}
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

                      {listen.old_thumbnail && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/listen/${listen.old_thumbnail}`}
                            alt="thumbnail"
                            width="120"
                            className="rounded border"
                          />
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* BUTTONS */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      color="primary"
                    >
                      Update Listen
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

export default UpdateListen;