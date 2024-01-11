import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {  Container,Card,Image } from 'react-bootstrap';
import { faAngleLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageSecond, setImageSecond] = useState(null);
  const [allImage, setAllImage] = useState([]); // Initialize allImage as an empty array
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [icNo, setIcNo] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [mmcRegistrationNo, setMmcRegistrationNo] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    getImage();
  }, []);

  const submitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("imageSecond", imageSecond);
    formData.append("username", username);
    formData.append("firstName", firstName);
    formData.append("surname", surname);
    formData.append("dob", dob);
    formData.append("icNo", icNo);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("mobileNo", mobileNo);
    formData.append("email", email);
    formData.append("hospitalName", hospitalName);
    formData.append("department", department);
    formData.append("position", position);
    formData.append("mmcRegistrationNo", mmcRegistrationNo);

    const result = await axios.post(
      "http://localhost:5555/upload-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // After successful image upload, update the state with the new image and username
    setAllImage([...allImage, { image: result.data.image, username }]);
    setShowSuccessModal(true);
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onInputChangeSecond = (e) => {
    setImageSecond(e.target.files[0]);
  };

  const getImage = async () => {
    const result = await axios.get("http://localhost:5555/get-image");
    setAllImage(result.data.data);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <Container>
      <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                <Link to="/login">  <FontAwesomeIcon icon={faAngleLeft} /></Link> Back
                </div>
                <div className="text-center">
                  <Image
                    src="./MML.png"
                    alt="Logo"
                    fluid
                    style={{ width: '100px', height: 'auto' }}
                    className="mx-auto"
                  />
                </div>
              </Card.Header>
    <div className="card">
      <div className="card-body">
      <form onSubmit={submitImage} className="mb-3">
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Surname:</label>
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="form-control"
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
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>IC No:</label>
        <input
          type="number"
          placeholder="IC No"
          value={icNo}
          onChange={(e) => setIcNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="form-control"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
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
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Mobile Phone:</label>
        <input
          type="number"
          placeholder="Mobile Phone No"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          className="form-control"
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Name of Hospital:</label>
        <input
          type="text"
          placeholder="Hospital Name"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Department:</label>
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="form-control"
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
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
   
    
  
    <div className="col-md-4">
      <div className="form-group">
        <label>MMC Registration No:</label>
        <input
          type="text"
          placeholder="MMC Registration No"
          value={mmcRegistrationNo}
          onChange={(e) => setMmcRegistrationNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    </div>
    <br></br>
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Profile photo:</label>
        
        <input
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="form-control"
        />
      </div>
    </div>
  

  
    <div className="col-md-4">
      <div className="form-group">
        <label>APC Certificate:</label>
        <input
          type="file"
          accept="image/*"
          onChange={onInputChangeSecond}
          className="form-control"
        />
      </div>
    </div>
    </div>
  
   <div className="d-flex justify-content-end" >
  <button type="submit" className="btn btn-primary">
    Submit
  </button>
  </div>
</form>


        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{
                fontSize: "3rem",
                color: "orange",
                marginBottom: "1rem",
              }}
            />
            <p>
              You are successfully submit your form for verification. Once
              verification is done, you will receive an email. Verification may
              take around 5 working days.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseSuccessModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
    </Card>
    </Container>
  );
}

export default ImageUpload;
