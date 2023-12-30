import React from 'react';
import { Form, Button, Container, Row, Col, Card, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Upload from './upload';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      surname: '',
      dob: '',
      icNo: '',
      gender: '',
      address: '',
      mobileNo: '',
      email: '',
      hospitalName: '',
      department: '',
      position: '',
      mmcRegistrationNo: '',
      profilePhoto: null,
      apcCertificate: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileUpload = (event) => {
    const { name, files } = event.target;
    this.setState({ [name]: files[0] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Add your sign-up logic here
    console.log('Form submitted:', this.state);
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={12}>
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
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col >
                      <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="Enter username"
                          value={this.state.username}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col >
                      <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          value={this.state.firstName}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col >
                      <Form.Group controlId="formSurname">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                          type="text"
                          name="surname"
                          placeholder="Enter surname"
                          value={this.state.surname}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col>
                      <Form.Group controlId="formDob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={this.state.dob}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formIcNo">
                        <Form.Label>IC No</Form.Label>
                        <Form.Control
                          type="text"
                          name="icNo"
                          placeholder="Enter IC No"
                          value={this.state.icNo}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={this.state.gender}
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col md={8}>
                      <Form.Group controlId="formAddress">
                        <Form.Label>Correspond Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          placeholder="Enter address"
                          value={this.state.address}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formMobileNo">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobileNo"
                          placeholder="Enter mobile no."
                          value={this.state.mobileNo}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={this.state.email}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formHospitalName">
                        <Form.Label>Name of Hospital</Form.Label>
                        <Form.Control
                          type="text"
                          name="hospitalName"
                          placeholder="Enter hospital name"
                          value={this.state.hospitalName}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formDepartment">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="department"
                          placeholder="Enter department"
                          value={this.state.department}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col>
                      <Form.Group controlId="formPosition">
                        <Form.Label>Position</Form.Label>
                        <Form.Control
                          type="text"
                          name="position"
                          placeholder="Enter position"
                          value={this.state.position}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formMmcRegistrationNo">
                        <Form.Label>MMC Registration No</Form.Label>
                        <Form.Control
                          type="text"
                          name="mmcRegistrationNo"
                          placeholder="Enter MMC Registration No"
                          value={this.state.mmcRegistrationNo}
                          onChange={this.handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br></br>
                  <Row>
                    <Col>
                    <Form.Group controlId="formProfilePhoto">
                        <Form.Label>Profile Photo</Form.Label>
                        
                        <Upload/>
                      </Form.Group>
                    
                    </Col>
                  <Col>
                  <Form.Group controlId="formAPCCertificate">
                        <Form.Label>APC Certificate</Form.Label>
                        
                        <Upload/>
                      </Form.Group>
                    
                  </Col>
                  </Row>
                  
                   <br></br>
                   <div className="d-flex justify-content-end"> {/* Use Bootstrap class to align content to the right */}
                  <Button variant="primary" type="submit">
                    Sign Up
                  </Button>
                </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Signup;
