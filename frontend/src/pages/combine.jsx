import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StentRecordTable = () => {
  const [stentRecords, setStentRecords] = useState([]);

  useEffect(() => {
    // Fetch stent records from the server
    axios.get('http://localhost:5555/stentRecords')
      .then((stentResponse) => {
        // Fetch patient data from the server
        axios.get('http://localhost:5555/getPatients')
          .then((patientResponse) => {
            // Ensure that patientData is an array
            const patientData = Array.isArray(patientResponse.data) ? patientResponse.data : [];

            // Combine stent records and patient data based on MRN No
            const combinedData = combineData(stentResponse.data, patientData);
            setStentRecords(combinedData);
          })
          .catch((patientError) => {
            console.error('Error fetching patient data:', patientError);
          });
      })
      .catch((stentError) => {
        console.error('Error fetching stent records:', stentError);
      });
  }, []);

  // Combine stent records and patient data based on MRN No
  const combineData = (stentData, patientData) => {
    return stentData.map((stentRecord) => {
      const matchingPatient = patientData.find((patient) => patient.mrnNo === stentRecord.mrnNo);
      if (matchingPatient) {
        return {
          ...stentRecord,
          icNo: matchingPatient.icNo,
          firstName: matchingPatient.firstName,
          surname: matchingPatient.surname,
          mobileNo: matchingPatient.mobileNo,
          email: matchingPatient.email,
        };
      }
      return stentRecord;
    });
  };

  return (
    <div>
      <h2>Stent Records</h2>
      <table className='border'>
        <thead>
          <tr>
          <th>No</th>
            <th>Case ID</th>
            <th>MRN No</th>
            <th>IC No</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Mobile No</th>
            <th>Email</th>
            <th>Stent Data</th>
          </tr>
        </thead>
        <tbody>
          {stentRecords.map((record, index) => (
            <tr key={index}>
             <td>{index + 1}</td> 
              <td>{record.caseID}</td>
              <td>{record.mrnNo}</td>
              <td>{record.icNo}</td>
              <td>{record.firstName}</td>
              <td>{record.surname}</td>
              <td>{record.mobileNo}</td>
              <td>{record.email}</td>
              <td>
                <ul>
                  {record.stentData.map((stent, index) => (
                    <li key={index}>
                      Laterality: {stent.laterality}<br />
                      Hospital Name: {stent.hospitalName}<br />
                      Inserted Date: {stent.insertedDate}<br />
                      Due Date: {stent.dueDate}<br />
                      Size: {stent.size}<br />
                      Length: {stent.length}<br />
                      Stent Type: {stent.stentType}<br />
                      Stent Brand: {stent.stentBrand}<br />
                      Place of Insertion: {stent.placeOfInsertion}<br />
                      Remarks: {stent.remarks}<br />
                    </li>
                  ))}
                </ul>
                Number of Stents: {record.stentData.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StentRecordTable;
