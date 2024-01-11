import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Table, Button, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineInfo, MdOutlineSearch, MdOutlineEmail } from 'react-icons/md';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../pages/userAction.js';

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

function HospitalUserList() {
  const [users, setUsers] = useState([]); // Updated variable name to "users"
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Updated variable name to "userToDelete"
  const [lastMrnNo, setLastMrnNo] = useState(0);
  const location = useLocation();
  const hospitalName = location.state.hospitalName;
  const { icNo, activeTab } = useSelector((state) => state.user);
 const navigate = useNavigate();
  useEffect(() => {

    if (!hospitalName) {
      // Handle the case where hospitalName is not available
      console.error('Hospital name not found in location state.');
      return;
    }
    // Fetch user data when the component mounts
    axios
      .get(`http://localhost:5555/users/${hospitalName}`) // Updated endpoint to fetch users based on hospitalName
      .then((response) => {
        setUsers(response.data.users);
        const lastUser = response.data.users.reduce((prev, current) => {
          return prev.mrnNo > current.mrnNo ? prev : current;
        }, {});

        setLastMrnNo(lastUser.mrnNo);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [hospitalName]);

  const filteredUsers = users && users.length > 0 ? users.filter((user) => {
    const mrnNo = user.mrnNo || '';
    const fullName = `${user.firstName || ''} ${user.surname || ''}`;
    const dob = formatDate(user.dob) || '';
    const icNo = user.icNo ? user.icNo.toString() : '';
    const gender = user.gender || '';
    const mobileNo = user.mobileNo ? user.mobileNo.toString() : '';
    const email = user.email || '';
  
    return (
      mrnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dob.includes(searchTerm) ||
      icNo.includes(searchTerm) ||
      gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobileNo.includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Implement your delete logic here
    axios
      .delete(`http://localhost:5555/user/${userToDelete._id}`) // Updated endpoint to delete users
      .then(() => {
        setShowSuccessModal(true);
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userToDelete._id));
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const generateNextMrnNo = () => {
    // Increment the last mrnNo
    setLastMrnNo((prevMrnNo) => prevMrnNo + 1);
    return lastMrnNo + 1;
  };

  

  return (
    <div>
      <div>{icNo}</div>
      <Container>
        <Row className="mt-3 mb-3">
          <Col md={7}>
            <h1>HOSPITAL {location.state.hospitalName} USER LIST</h1>
          
          </Col>
          <Col md={5} className="d-flex justify-content-end">
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>MRN No</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>IC No</th>
                  <th>Gender</th>
                  <th>Mobile No</th>
                  <th>Department</th>
                  <th>Position</th>
<th>Operations</th>

                  {/* Add additional table headers based on your user data */}
                  {/* <th>No of Stent</th>
                    <th>Operation</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.mmcRegistrationNo}</td>
                    <td>{`${user.firstName} ${user.surname}`}</td>
                    <td>{formatDate(user.dob)}</td>
                    <td>{user.icNo}</td>
                    <td>{user.gender}</td>
                    <td>{user.mobileNo}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    
                    <td className="text-center">
                  
                  
                <Link key={user._id} to={`/user/details/${user._id}`}>
                    <Button variant="light" className="transparent-button" >
                      <MdOutlineSearch className="blue-icon icon-large" />
                    </Button>
                    </Link>
                    
                  <Button
                    variant="light"
                    className="transparent-button"
                    onClick={() => handleEditClick(patient)}
                  >
                    <MdOutlineEmail className="brown-icon icon-large" />
                  </Button>
                  <Link key={user._id} to={`/updateUser/${user._id}`}>
                  <Button
                    variant="light"
                    className="transparent-button"
                    
                  >
                    <MdOutlineEdit className="black-icon icon-large" />
                  </Button>
                  </Link>
                  <Button
                    variant="light"
                    className="transparent-button"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <MdOutlineDelete className="red-icon icon-large" />
                  </Button>
                </td>
                    {/* Add additional table data based on your user data */}
                    {/* <td>{user.stentData.length}</td>
                        <td className="text-center">
                          <Link to={`/showStent/${user._id}`}>
                            <Button variant='primary'> Show Stent</Button>
                          </Link>
                          <Link to={`/showUserByID/${user._id}`}>
                            <Button variant="light" className="transparent-button">
                              <MdOutlineSearch className="blue-icon icon-large" />
                            </Button>
                          </Link>
                          <Button
                            variant="light"
                            className="transparent-button"
                            onClick={() => handleEditClick(user)}
                          >
                            <MdOutlineEmail className="brown-icon icon-large" />
                          </Button>
                          <Link to={`/updateUserByID/${user._id}`}>
                            <Button
                              variant="light"
                              className="transparent-button"
                            >
                              <MdOutlineEdit className="black-icon icon-large" />
                            </Button>
                          </Link>
                          <Button
                            variant="light"
                            className="transparent-button"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <MdOutlineDelete className="red-icon icon-large" />
                          </Button>
                        </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {/* Add your buttons or other UI elements here */}
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <p>Are you sure you want to delete {userToDelete.firstName} {userToDelete.surname}?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>User deleted successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HospitalUserList;