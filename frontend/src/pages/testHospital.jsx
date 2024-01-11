import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [patientHospitals, setPatientHospitals] = useState([]);

  useEffect(() => {
    // Fetch all hospitals
    axios
      .get("http://localhost:5555/hospitals")
      .then((response) => {
        setHospitals(response.data.hospitals);
      })
      .catch((error) => {
        console.error('Error fetching hospitals:', error);
      });

    // Fetch patient hospitals
    axios
      .get("http://localhost:5555/hospitalsP")
      .then((response) => {
        setPatientHospitals(response.data.hospitals);
      })
      .catch((error) => {
        console.error('Error fetching patient hospitals:', error);
      });
  }, []);

  return (
    <Container>
      <Row>
        <Col md={6}>
          <h2>All Hospitals</h2>
          <ListGroup>
            {hospitals.map((hospital, index) => (
              <ListGroup.Item key={index}>{hospital}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h2>Patient Hospitals</h2>
          <ListGroup>
            {patientHospitals.map((hospital, index) => (
              <ListGroup.Item key={index}>{hospital}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default HospitalList;