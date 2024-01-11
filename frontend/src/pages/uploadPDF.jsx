import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container, Card, Row, Col, Image } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Navbars from '../pages/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../pages/userAction.js';
import { Link,useNavigate } from 'react-router-dom';

function UploadPDF() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  let profileImageSrc = '/images/DefaultProfilePic.jpg';
  const { icNo, activeTab } = useSelector((state) => state.user);
const navigate = useNavigate();
const [hospitalNames, setHospitalNames] = useState([]);
const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
const [userData, setUserData] = useState(null);
const [roleData, setRoleData] = useState(null);
  const [patientRoleData, setPatientRoleData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // useEffect(() => {
  //   // Fetch additional user data based on the stored token or user information
  //   const fetchUserData = async () => {
  //     try {
       
        
  //       // You should ideally send the authentication token with the request
  //       // For simplicity, assuming the server knows the user based on the token
  //       let endpoint = '';
  //       if (activeTab === 'staff') {
  //         endpoint = `http://localhost:5555/getStaffByEmail/${icNo}`;
  //       } else if (activeTab === 'patient') {
  //         endpoint = `http://localhost:5555/getPatientByEmail/${icNo}`;
  //       } else {
  //         // Handle other cases or show an error
  //         console.error('Invalid user type:', activeTab);
  //         // Redirect to login or handle the error as needed
  //         navigate('/login');
  //         return;
  //       }
  
  //       const response = await axios.get(endpoint, {
  //         // headers: { Authorization: `Bearer ${yourAuthToken}` },
  //       });
  

  //       if (activeTab === 'staff') {
  //         setUserData(response.data.staff); // Change from 'user' to 'patient' based on your server response
  //         const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
  //         setRoleData(roleResponse.data);
       

          
  //       }
  //       else if(activeTab === 'patient'){
  //         setUserData(response.data.patient);
  //         const patientRoleResponse = await axios.get(`http://localhost:5555/role/patient`);
  //         setPatientRoleData(patientRoleResponse.data);
          
  //       }
        
  //       else {
  //         // Handle other cases or show an error
  //         console.error('Invalid user type:', activeTab);
  //         // Redirect to login or handle the error as needed
  //         navigate('/login');
  //         return;
  //       }
  //      // Default image


        
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //       // Handle error (e.g., redirect to login)
  //       navigate('/login');
  //     }
  //   };

  //   fetchUserData();
  // }, [navigate, icNo]); 

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('title', title);
    formData.append('picture', picture);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:5555/pdf-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFile(response.data.pdfFile);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div>
      <div>
        <Navbars/>
      </div>
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/"> <FontAwesomeIcon icon={faAngleLeft} /></Link> Back
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
            <br />
            <Card.Body>
              <Form>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formPdfFile">
                  <Form.Label>PDF File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPictureFile">
                  <Form.Label>Picture File</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPicture(e.target.files[0])}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>

                <br />
                <div className="d-flex justify-content-end">
                  <Button variant="primary" onClick={handleFileUpload}>
                    Upload PDF
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

    
<Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
<Modal.Header closeButton>
  <Modal.Title>Upload Successful</Modal.Title>
</Modal.Header>
<Modal.Body>
  Your PDF has been successfully uploaded.
  {/* You can add more details or links here if needed */}
</Modal.Body>
<Modal.Footer>
  <Button variant="success" onClick={handleCloseSuccessModal}>
    Close
  </Button>
</Modal.Footer>
</Modal>
</div>
  );
}

export default UploadPDF;
