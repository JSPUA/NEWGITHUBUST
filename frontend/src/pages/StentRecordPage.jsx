import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function StentRecordPage() {
  const { id, stentIndex } = useParams();
  const [patientData, setPatientData] = useState(null); // Add patientData state
  const [stentRecord, setStentRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientResponse = await axios.get(`http://localhost:5555/getPatientById/${id}`);
        setPatientData(patientResponse.data);

        // Fetch stent data
        const stentResponse = await axios.get(`http://localhost:5555/getStent/${id}/${patientData.stentData[stentIndex]}`);
        setStentRecord(stentResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, stentIndex]);

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h2>Stent Record</h2>
      {stentRecord ? (
        <div>
          <p>Laterality: {stentRecord.laterality}</p>
          <p>Hospital Name: {stentRecord.hospitalName}</p>
          <p>Inserted Date: {stentRecord.insertedDate}</p>
          {/* Add other stent fields similarly */}
        </div>
      ) : (
        <p>No stent record available.</p>
      )}
    </div>
  );
}

export default StentRecordPage;
