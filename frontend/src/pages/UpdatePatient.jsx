import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,Link, useNavigate  } from 'react-router-dom';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  // State for the edited patient data
  const [editedPatientData, setEditedPatientData] = useState({
    firstName: '',
    surname: '',
    dob: '',
    mrnNo: '',
    icNo: '',
    gender: '',
    mobileNo: '',
    email: '',
    ethnicity:'',
    nextOfKin: {
      firstName: '',
      surname: '',
      mobileNo: '',
    },
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the input field name contains a dot (indicating a nested object property)
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.'); // Split the name into parent and child keys
      setEditedPatientData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey], // Preserve other properties in the parent object
          [childKey]: value,
        },
      }));
    } else {
      setEditedPatientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a PUT request to update the patient's data
      await axios.put(`http://localhost:5555/updatePatient/${id}`, editedPatientData);
      setShowSuccessModal(true);
      // Reload the patient data after the update
      const response = await axios.get(`http://localhost:5555/getPatientById/${id}`);
      setPatient(response.data.patient);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Fetch patient data by ID
    axios
      .get(`http://localhost:5555/getPatientById/${id}`)
      .then((response) => {
        setPatient(response.data.patient);
        setEditedPatientData(response.data.patient); // Set the edited data initially
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
          </Link>Back
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
          <form onSubmit={handleSubmit} className="mb-3">
            {/* Display patient information */}
            
            <h2>Edit Patient Information</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    First Name:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editedPatientData.firstName}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Surname:
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={editedPatientData.surname}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group"> 
                  <label>
                    Date of birth: 
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formatDate(editedPatientData.dob)}
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
                  type="text"
                  placeholder="Enter MRN No"
                  name="mrnNo"
                  value={editedPatientData.mrnNo}
                  onChange={handleInputChange}
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
                  value={editedPatientData.icNo}
                  onChange={handleInputChange}
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
                  value={editedPatientData.gender}
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
                  type="text"
                  placeholder="Enter Mobile No"
                  name="mobileNo"
                  value={editedPatientData.mobileNo}
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
                  value={editedPatientData.email}
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
                  value={editedPatientData.ethnicity}
                  onChange={handleInputChange}
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
                  name="nextOfKin.firstName"
                  value={editedPatientData.nextOfKin.firstName}
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
                  name="nextOfKin.surname"
                  value={editedPatientData.nextOfKin.surname}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              <div className="col-md-4">
              <div className="form-group">
                <label>Next of Kin Mobile No:</label>
                <input
                  type="text"
                  placeholder="Enter Next of Kin Mobile No"
                  name="nextOfKin.mobileNo"
                  value={editedPatientData.nextOfKin.mobileNo}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              </div>
              </div>
              <br></br>
            {/* Add more form fields for other patient details */}
            <div className="d-flex justify-content-end" >
            <Button variant="primary" type="submit">Update</Button></div>
          </form>
          <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{
                    fontSize: '3rem',
                    color: 'orange',
                    marginBottom: '1rem',
                  }}
                />
                <p>You have successfully updated the patient's information.</p>
              </Modal.Body>
              <Modal.Footer>
              <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/showPatient'); // Redirect to /showPatient
            }}
          >
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

export default PatientDetails;
