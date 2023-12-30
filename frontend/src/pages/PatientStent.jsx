import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StentDataPage from './StentDataPage'; // Import the new component

// ... (other code)

function PatientStent() {
  const [patient, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    // Fetch patient data when the component mounts
    axios
      .get('http://localhost:5555/getPatients')
      .then((response) => {
        setPatients(response.data.patients);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);

  const handleInfoClick = (patient) => {
    setSelectedPatient(patient);
  };

  // ... (other code)

  return (
    <div>
      {/* ... (other JSX code) */}
      <Link key={patient._id} to={`/showPatientByID/${patient._id}`}>AAA</Link>
      <Link to="/stent-data">View Stent Data</Link>
      <Link to="/stent-data">View Stent Data</Link><Link to="/stent-data">View Stent Data</Link>
      <StentDataPage
        stentData={selectedPatient ? selectedPatient.stentData : []}
      />
    </div>
  );
}

export default PatientStent;
