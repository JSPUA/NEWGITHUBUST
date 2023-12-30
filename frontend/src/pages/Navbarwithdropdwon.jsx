import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function SimpleNavbar() {
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    const fetchHospitalNames = async () => {
      try {
        const response = await fetch('http://localhost:5555/hospitalsP');
        const data = await response.json();
        setHospitalNames(data.hospitals);
      } catch (error) {
        console.error('Error fetching hospital names:', error);
      }
    };

    fetchHospitalNames();
    setUserRole('doctor');
  }, []);

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  const renderNavForRole = () => {
    switch (userRole) {
      case 'admin':
        return (
          <>
            <Nav.Link href="#">Dashboard</Nav.Link>
            <Nav.Link href="#">Manage Hospitals</Nav.Link>
          </>
        );
      case 'doctor':
        return (
          <NavDropdown title={selectedHospital || 'Select Hospital'} id="basic-nav-dropdown">
            {hospitalNames.map((hospital, index) => (
              <NavDropdown.Item key={index} onClick={() => handleHospitalSelect(hospital)}>
                {hospital}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        );
      default:
        return <Nav.Link href="#">Home</Nav.Link>;
    }
  };

  return (
    <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#">Your Logo</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        {renderNavForRole()}
      </Nav>
      <Nav>
        <Nav.Link href="#">Your Profile</Nav.Link>
        <Nav.Link href="#">Logout</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
}

export default SimpleNavbar;



