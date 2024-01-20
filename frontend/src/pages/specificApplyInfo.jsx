import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { faSearchPlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Container, Card, Image } from "react-bootstrap";

function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const SpecificApplyInfo = () => {
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessApproveModal, setShowSuccessApproveModal] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/api/userRegistration/${id}`)
      .then((response) => {
        setImage(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const handleDeleteConfirm = () => {
    // Send a DELETE request to your API to delete the specific item by ID
    axios
      .delete(`http://localhost:5555/get-image/${id}`)
      .then(() => {
        // Close the delete modal
        setShowDeleteModal(false);
        setShowSuccessModal(true);
        // Redirect the user to a different page or perform other actions as needed
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleApprove = async () => {
    try {
      // Make a POST request to the approval endpoint
      const response = await axios.post(`http://localhost:5555/addUser/${id}`);

      const mailResponse = await fetch(
        "http://localhost:5555/api/mail/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: image.email,
            username: image.username,
          }),
        }
      );

      console.log("email sent", mailResponse);
      // Handle success, e.g., show a success message or redirect
      console.log("Application approved successfully:", response.data.user);
      setShowSuccessApproveModal(true);
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  const closeSuccessModal = () => {
    // Close the success modal
    setShowSuccessModal(false);
    // Redirect to a different page or perform other actions as needed
  };

  return (
    <div className="p-4">
      <BackButton />
      {/* <h1 className='text-3xl my-4'>Application Information</h1> */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          {/*  here is picture  */}

          {/* until here */}

          <Container>
            <Card
              style={{
                backgroundColor: "white",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to="/login">
                    {" "}
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </Link>{" "}
                  Back
                </div>
                <div className="text-center">
                  <Image
                    src={`http://localhost:5555/getFiles/hsaas logo.png`}
                    alt="Logo"
                    fluid
                    style={{ width: "100px", height: "auto" }}
                    className="mx-auto"
                  />
                </div>
              </Card.Header>
              <div className="card">
                <div className="card-body">
                  <form className="mb-3">
                    <h1 className="text-3xl my-4">Application Information</h1>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Username:</label>
                          <input
                            type="text"
                            placeholder="Enter Username"
                            defaultValue={image.username}
                            //   onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>First Name:</label>
                          <input
                            type="text"
                            placeholder="First Name"
                            defaultValue={image.firstName}
                            //   onChange={(e) => setFirstName(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Surname:</label>
                          <input
                            type="text"
                            placeholder="Surname"
                            defaultValue={image.surname}
                            //   onChange={(e) => setSurname(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Date of Birth:</label>
                          <input
                            type="date"
                            placeholder="Date of Birth"
                            defaultValue={formatDate(image.dob)}
                            //   onChange={(e) => setDob(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>IC No:</label>
                          <input
                            type="number"
                            placeholder="IC No"
                            defaultValue={image.icNo}
                            //   onChange={(e) => setIcNo(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Gender</label>
                          <input
                            type="text"
                            placeholder="Gender"
                            defaultValue={image.gender}
                            //   onChange={(e) => setIcNo(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Address:</label>
                          <input
                            type="text"
                            placeholder="Address"
                            defaultValue={image.address}
                            //   onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Mobile Phone:</label>
                          <input
                            type="number"
                            placeholder="Mobile Phone No"
                            defaultValue={image.mobileNo}
                            //   onChange={(e) => setMobileNo(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            type="email"
                            placeholder="Email"
                            defaultValue={image.email}
                            //   onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Name of Hospital:</label>
                          <input
                            type="text"
                            placeholder="Hospital Name"
                            defaultValue={image.hospitalName}
                            //   onChange={(e) => setHospitalName(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Department:</label>
                          <input
                            type="text"
                            placeholder="Department"
                            defaultValue={image.department}
                            //   onChange={(e) => setDepartment(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Position:</label>
                          <input
                            type="text"
                            placeholder="Position"
                            defaultValue={image.position}
                            //   onChange={(e) => setPosition(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group">
                          <label>MMC Registration No:</label>
                          <input
                            type="text"
                            placeholder="MMC Registration No"
                            defaultValue={image.mmcRegistrationNo}
                            //   onChange={(e) => setMmcRegistrationNo(e.target.value)}
                            className="form-control"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="text-xl mr-4 text-gray-500">
                          APC Certificate:
                        </div>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <a
                            href={`http://localhost:5555/getFiles/${image.apc}`}
                            download={
                              image.apc ? image.apc.split("/").pop() : ""
                            }
                          >
                            <img
                              src={`http://localhost:5555/getFiles/${image.apc}`}
                              alt="APC Certificate"
                              width={130}
                              height={100}
                            />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="profile-photo-container">
                      <div>
                        <div
                          className="text-xl text-gray-500"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            textAlign: "left",
                          }}
                        >
                          Profile Picture:
                        </div>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={`http://localhost:5555/getFiles/${image.photo}`}
                            alt="Profile Image"
                            width={80}
                            height={100}
                          />
                          <img
                            src="/magnifier.png"
                            alt="Custom Magnifier"
                            width={20}
                            height={20}
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            }}
                            onClick={() =>
                              openImageModal(
                                `http://localhost:5555/getFiles/${image.photo}`
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <Link to="/sampleTable">
                        <button
                          type="submit"
                          className="btn btn-success"
                          onClick={handleApprove}
                        >
                          Approve
                        </button>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete
                      </button>
                    </div>
                  </form>

                  <Modal show={showImageModal} onHide={closeImageModal}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <img
                        src={modalImage}
                        alt="Enlarged Image"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </Card>
            <Modal
              show={showDeleteModal}
              onHide={() => setShowDeleteModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this application?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={closeSuccessModal}>
              <Modal.Header closeButton>
                <Modal.Title>Success!</Modal.Title>
              </Modal.Header>
              <Modal.Body>Application deleted successfully!</Modal.Body>
              <Modal.Footer>
                <Link to="/sampleTable">
                  <Button variant="primary" onClick={closeSuccessModal}>
                    Close
                  </Button>
                </Link>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showSuccessApproveModal}
              onHide={() => setShowSuccessApproveModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Approval Success!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Application approved successfully! Click the button below to
                view the updated table.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowSuccessApproveModal(false)}
                >
                  Close
                </Button>
                <Link to="/sampleTable">
                  <Button variant="primary">Go to Sample Table</Button>
                </Link>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
      )}
    </div>
  );
};

export default SpecificApplyInfo;
