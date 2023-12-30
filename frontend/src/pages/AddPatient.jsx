import React, { useState,useEffect } from "react";
import axios from "axios";
import { Container, Card, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faAngleLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function AddPatient() {
  const [password, setPassword] = useState("");  
  const [showPassword, setShowPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState("");
  const [showPasswordMismatchModal, setShowPasswordMismatchModal] = useState(false);
  const saltRounds = 10; 
  const [lastMrnNo, setLastMrnNo] = useState(0);
  const [formData, setFormData] = useState({
    // ... your form data fields
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Fetch the last MRN No when the component mounts
    axios
      .get("http://localhost:5555/getLastMrnNo")
      .then((response) => {
        setLastMrnNo(response.data.lastMrnNo);
        console.log(lastMrnNo);
      })
      .catch((error) => {
        console.error("Error fetching last MRN No:", error);
      });
  }, []);

  const submitPatient = async (e) => {
    e.preventDefault();

    validatePasswords();

    if (!passwordsMatch) {
        // Passwords don't match, show the password mismatch modal
        setShowPasswordMismatchModal(true);
        return;
      }
  

  
    const patientData = {
      ...formData, password,  
    };

    try {
      const response = await axios.post("http://localhost:5555/addPatients", patientData);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswords = () => {
    setPasswordsMatch(formData.password === retypePassword);
  };
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

 

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleClosePasswordMismatchModal = () => {
    setShowPasswordMismatchModal(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // Check if passwords match when the password field changes
    setPasswordsMatch(event.target.value === retypePassword);
  };

  const handleRetypePasswordChange = (event) => {
    setRetypePassword(event.target.value);
    // Check if passwords match when the retype password field changes
    setPasswordsMatch(password === event.target.value);
  };
 

  return (
    <Container>
      <Card style={{ backgroundColor: "white", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <Link to="/login">
              <FontAwesomeIcon icon={faAngleLeft} />
            </Link>{" "}
            Back
          </div>
          <div className="text-center">
            <Image
              src="./MML.png"
              alt="Logo"
              fluid
              style={{ width: "100px", height: "auto" }}
              className="mx-auto"
            />
          </div>
        </Card.Header>
        <div className="card">
          <div className="card-body">
            <h2>PERSONAL BIODATA</h2>
            <form onSubmit={submitPatient} className="mb-3">
            <div className="row">
                <div className="col-md-4">
              {/* Include form fields for patient information */}
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Surname:</label>
                <input
                  type="text"
                  placeholder="Enter Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="Date"
                  placeholder="Enter Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
<br></br>
              <div className="row">
                <div className="col-md-4">
              <div className="form-group">
                <label>MRN No:</label>
                <input
                  type="number"
                  placeholder="Enter MRN No"
                  name="mrnNo"
                  value={formData.mrnNo}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>IC No:</label>
                <input
                  type="number"
                  placeholder="Enter IC No"
                  name="icNo"
                  value={formData.icNo}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
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
                <div className="col-md-4">
              <div className="form-group">
                <label>Mobile No:</label>
                <input
                  type="number"
                  placeholder="Enter Mobile No"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
</div>
<div className="col-md-4">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
</div>
<div className="col-md-4">
              <div className="form-group">
                <label>Ethnicity:</label>
                <input
                  type="text"
                  placeholder="Enter Ethnicity"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-md-4">
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="form-control"
                  required
                />
                <div className="input-group-append">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={handleTogglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                    /> Show Password
                  </Button>
                </div>
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Retype Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="retypePassword"
                  placeholder="Retype password"
                  value={retypePassword}
                  onChange={handleRetypePasswordChange}
                  className="form-control"
                  required
                />
              </div>
              </div>
              </div>
              <div>
      {passwordsMatch ? (
        <p>Passwords match.</p>
      ) : (
        <p>Passwords do not match.</p>
      )}
      
    </div>
    <hr />
    <h2>NEXT OF KIN'S BIODATA</h2>
    <div className="row">
                <div className="col-md-4">
              <div className="form-group">
                <label>Next of Kin First Name:</label>
                <input
                  type="text"
                  placeholder="Enter Next of Kin First Name"
                  name="nextOfKinFirstName"
                  value={formData.nextOfKinFirstName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
</div>
<div className="col-md-4">
              <div className="form-group">
                <label>Next of Kin Surname:</label>
                <input
                  type="text"
                  placeholder="Enter Next of Kin Surname"
                  name="nextOfKinSurname"
                  value={formData.nextOfKinSurname}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Next of Kin Mobile No:</label>
                <input
                  type="number"
                  placeholder="Enter Next of Kin Mobile No"
                  name="nextOfKinMobileNo"
                  value={formData.nextOfKinMobileNo}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
              <br></br>
              {/* Add a submit button */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>

            {/* Success modal */}
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
                  You have successfully submitted the patient's information.
                  {/* Add any success message here */}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleCloseSuccessModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showPasswordMismatchModal} onHide={handleClosePasswordMismatchModal}>
              <Modal.Header closeButton>
                <Modal.Title>Password Mismatch</Modal.Title>
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
                <p>The entered password and retype password do not match. Please make sure they are the same.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={handleClosePasswordMismatchModal}>
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

export default AddPatient;
