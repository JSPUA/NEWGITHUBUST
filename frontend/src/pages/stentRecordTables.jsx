import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StentRecordTable = () => {
  const [stentRecords, setStentRecords] = useState([]);

  useEffect(() => {
    // Fetch stent records from the server when the component mounts
    axios.get('http://localhost:5555/stentRecords')
      .then((response) => {
        setStentRecords(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stent records:', error);
      });
  }, []);

  return (
    <div>
      <h2>Stent Records</h2>
      <table className='border'>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>MRN No</th>
            <th>IC No</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Mobile No</th>
            <th>Email</th>
            <th>Stent Data</th>
            <th>No of Stent </th>
          </tr>
        </thead>
        <tbody>
          {stentRecords.map((record) => (
            <tr key={record._id}>
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
              <td>  Number of Stents: {record.stentData.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StentRecordTable;
