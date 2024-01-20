import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Navbar, Nav, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbars from "./Navbar";
function RolePermissions() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const allPermissions = [
    "addPatient",
    "viewPatient",
    "editPatient",
    "deletePatient",
    "addStent",
    "viewResearch",
    "addResearch",
    "contactDR",
    "myStentRecord",
    "setRole",
    "viewDailyReport",
    "viewSpecificTimeReport",
    "viewFurtherReport",
  ];
  const [selectedHospital, setSelectedHospital] = useState("Hospital A");
  const hospitals = ["Hospital A", "Hospital B", "Hospital C"]; // Add your list of hospitals

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
    // Add logic to handle hospital change, such as fetching data for the selected hospital
  };
  useEffect(() => {
    axios
      .get("http://localhost:5555/role")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  useEffect(() => {
    const selectedRole = roles.find((role) => role.name === selectedRoleName);
    setPermissions(selectedRole ? selectedRole.permissions : []);
  }, [selectedRoleName, roles]);

  const handleRoleChange = (event) => {
    setSelectedRoleName(event.target.value);
  };

  const togglePermission = (permission) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  const updateRolePermissions = () => {
    axios
      .put("http://localhost:5555/role", {
        name: selectedRoleName,
        permissions: permissions,
      })
      .then((response) => {
        console.log("Permissions updated:", response.data);
        setShowModal(true);
      })
      .catch((error) => console.error("Error updating permissions:", error));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // Refresh the page
  };

  const isPermissionInRole = (permission) => permissions.includes(permission);

  return (
    <div>
      {/* <Navbar bg="light"  expand="lg">
                <Navbar.Brand href="#"><Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        {isPermissionInRole('addPatient') && <Nav.Link href="/addPatient">Add Patients</Nav.Link>}
                        {isPermissionInRole('viewPatient') && <Nav.Link href="/showPatient"> View Patients</Nav.Link>}
                        {isPermissionInRole('editPatient') && <Nav.Link href="#">Edit Patients</Nav.Link>}
                        {isPermissionInRole('deletePatient') && <Nav.Link href="#">Delete Patients</Nav.Link>}
                        {isPermissionInRole('addStent') && <Nav.Link href="#">Add Stent</Nav.Link>}
                        {isPermissionInRole('viewResearch') && <Nav.Link href="/researchList">View Research</Nav.Link>}
                        {isPermissionInRole('addResearch') && <Nav.Link href="/uploadPDF">Add Research</Nav.Link>}
                        {isPermissionInRole('contactDR') && <Nav.Link href="/uploadPDF">Contact DR</Nav.Link>}
                        {isPermissionInRole('myStentRecord') && <Nav.Link href="/uploadPDF">My Stent Record</Nav.Link>}
                       
                    </Nav>
                    <div className="d-flex align-items-center">
  <span className="mr-2">Hospital:</span>
  
  <Form.Control as="select" value={selectedHospital} onChange={handleHospitalChange}>
    {hospitals.map((hospital) => (
      <option key={hospital} value={hospital}>
        {hospital}
      </option>
    ))}
  </Form.Control>
</div>
                </Navbar.Collapse>
            </Navbar> */}
      <Navbars />
      <h1>Role and Permissions</h1>
      <div>
        <Form.Group controlId="roleSelect">
          <Form.Label>Select a role:</Form.Label>
          <Form.Control
            as="select"
            value={selectedRoleName}
            onChange={handleRoleChange}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      <div>
        <h2>Permissions:</h2>
        <div>
          {allPermissions.map((permission, index) => (
            <Button
              key={index}
              variant={isPermissionInRole(permission) ? "primary" : "secondary"}
              className="m-1"
              onClick={() => togglePermission(permission)}
            >
              {permission}
            </Button>
          ))}
        </div>
        <Button
          className="m-1 mt-3"
          variant="success"
          onClick={updateRolePermissions}
        >
          Update Permissions
        </Button>
      </div>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Permissions have been updated successfully.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RolePermissions;
