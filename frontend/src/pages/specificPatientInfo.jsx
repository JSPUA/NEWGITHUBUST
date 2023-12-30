import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Image, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faAngleLeft } from '@fortawesome/free-solid-svg-icons';


function formatDate(isoDate) {
    if (!isoDate) {
      return '';
    }
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  

function PatientDetails() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch patient data by ID
    axios
      .get(`http://localhost:5555/getPatientById/${id}`)
      .then((response) => {
        setPatient(response.data.patient);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <Link to="/login">
              <FontAwesomeIcon icon={faAngleLeft} />
            </Link>{" "}
            Back
          </div>
          <div className="text-center">
            <Image
              src={`/MML.png`}
              alt="Logo"
              fluid
              style={{ width: '100px', height: 'auto' }}
              className="mx-auto"
            />
          </div>
        </Card.Header>
        <div className="card">
          <div className="card-body">
            
       
          <h2>PERSONAL BIODATA</h2>
            <form  className="mb-3">
            <div className="row">
                <div className="col-md-4">
              {/* Include form fields for patient information */}
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={patient.firstName}
                //   onChange={handleInputChange}
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
                  value={patient.surname}
                //   onChange={handleInputChange}
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
                  value={formatDate(patient.dob)}
                //   onChange={handleInputChange}
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
                  type="text"
                  placeholder="Enter MRN No"
                  name="mrnNo"
                  value={patient.mrnNo}
                //   onChange={handleInputChange}
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
                  value={patient.icNo}
                //   onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={patient.gender}
                //   onChange={handleInputChange}
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
                  value={patient.mobileNo}
                //   onChange={handleInputChange}
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
                  value={patient.email}
                //   onChange={handleInputChange}
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
                  value={patient.ethnicity}
                //   onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
              <br></br>
             
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
                  value={patient.nextOfKin.firstName}
                //   onChange={handleInputChange}
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
                  value={patient.nextOfKin.surname}
                //   onChange={handleInputChange}
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
                  value={patient.nextOfKin.mobileNo}
                //   onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
              <br></br>
              </form>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default PatientDetails;
