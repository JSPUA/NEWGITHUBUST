import React, { useState } from "react";
import { Container, Col, Form, Row, Button, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import { Link } from "react-router-dom";

function Upload() {
  const application = new FormData();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    surname: "",
    dob: "",
    icNo: "",
    gender: "",
    address: "",
    mobileNo: "",
    email: "",
    hospitalName: "",
    department: "",
    position: "",
    mmcRegistrationNo: "",
    photo: null,
    apc: null,
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHospitalChange = (event) => {
    const selectedHospital = event.target.value;
    setFormData({
      ...formData,
      hospitalName: selectedHospital, // Update the hospitalName field
    });
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setFormData({
      ...formData,
      gender: selectedGender, // Update the hospitalName field
    });
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setFormData({
      ...formData,
      department: selectedDepartment, // Update the hospitalName field
    });
  };

  const handlePositionChange = (event) => {
    const selectedPosition = event.target.value;
    setFormData({
      ...formData,
      position: selectedPosition, // Update the hospitalName field
    });
  };

  const handlePhotoUpload = (e) => {
    const { files } = e.target;
    console.log("Photo file:", files[0]);
    setFormData({
      ...formData,
      photo: files[0],
    });
  };

  const handleCertificateUpload = (e) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      apc: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    application.append("username", formData.username);
    application.append("firstName", formData.firstName);
    application.append("surname", formData.surname);
    application.append("dob", formData.dob);
    application.append("icNo", formData.icNo);
    application.append("gender", formData.gender);
    application.append("address", formData.address);
    application.append("mobileNo", formData.mobileNo);
    application.append("email", formData.email);
    application.append("hospitalName", formData.hospitalName);
    application.append("department", formData.department);
    application.append("position", formData.position);
    application.append("mmcRegistrationNo", formData.mmcRegistrationNo);
    application.append("photo", formData.photo);
    application.append("apc", formData.apc);

    console.log("mmc", application.get("address"));

    const response = await fetch("http://localhost:5555/api/userRegistration", {
      method: "POST",
      body: application,
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      const sendMail = await fetch("http://localhost:5555/api/mail/signup", {
        method: "POST",
        // Add any data you need to send in the body
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const secondJson = await sendMail.json();

      // Handle the response from the second API request
      console.log("Email sent", secondJson);

      handleShowModal();

      setFormData({
        username: "",
        firstName: "",
        surname: "",
        dob: "",
        icNo: "",
        gender: "",
        address: "",
        mobileNo: "",
        email: "",
        hospitalName: "",
        department: "",
        position: "",
        mmcRegistrationNo: "",
        photo: null,
        apc: null,
      });

      setError(null);
    }

    console.log("Application submitted", json);
  };

  return (
    <Container
      fluid="md"
      className="container"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          padding: "20px",
        }}
      >
        Signup as User
      </h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridusername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formGridFirstname">
              <Form.Label>First name</Form.Label>
              <Form.Control
                placeholder="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group as={Col} controlId="formGridSurname">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                placeholder="Surname"
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <input
                type="date"
                placeholder="Enter Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </Col>

          <Form.Group as={Col} controlId="formGridIC">
            <Form.Label>IC Number</Form.Label>
            <Form.Control
              placeholder="012345100123"
              type="text"
              name="icNo"
              value={formData.icNo}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select value={formData.gender} onChange={handleGenderChange}>
              <option>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridMobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                placeholder="0123456789"
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formGridEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                placeholder="example@email.com"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridHospital">
              <Form.Label>Hospital</Form.Label>
              <Form.Select
                value={formData.hospitalName}
                onChange={handleHospitalChange}
              >
                <option>Select Hospital</option>
                <option value="HSAAS">HSAAS</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formGridDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={formData.department}
                onChange={handleDepartmentChange}
              >
                <option>Select Department</option>
                <option value="Urology">Urology</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formGridPosition">
              <Form.Label>Position/Designation</Form.Label>
              <Form.Select
                value={formData.position}
                onChange={handlePositionChange}
              >
                <option>Select Position</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
                <option value="superAdmin">Super Admin</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formGridMMC">
              <Form.Label>MMC Registration Number</Form.Label>
              <Form.Control
                type="text"
                name="mmcRegistrationNo"
                value={formData.mmcRegistrationNo}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Photo</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handlePhotoUpload}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>APC Certificate</Form.Label>
              <Form.Control
                type="file"
                name="apc"
                onChange={handleCertificateUpload}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" style={{ marginRight: "10px" }}>
          Submit
        </Button>
        <Link to="/login">
          <Button variant="danger">Back</Button>
        </Link>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your form has been submitted successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Upload;
