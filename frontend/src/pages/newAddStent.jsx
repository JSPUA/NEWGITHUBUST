import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddStent = ({ mrnNo }) => {
  const { id } = useParams();
  const [newStents, setNewStents] = useState([
    {
      laterality: '',
      hospitalName: '',
      insertedDate: '',
      dueDate: '',
      size: '',
      length: '',
      stentType: '',
      stentBrand: '',
      placeOfInsertion: '',
      remarks: '',
    },
  ]);

  const handleInputChange = (e, stentIndex, field) => {
    const updatedStents = [...newStents];
    updatedStents[stentIndex][field] = e.target.value;
    setNewStents(updatedStents);
  };

  const addStent = () => {
    if (newStents.length < 2) {
      const updatedStents = [...newStents];
      updatedStents.push({
        laterality: '',
        hospitalName: '',
        insertedDate: '',
        dueDate: '',
        size: '',
        length: '',
        stentType: '',
        stentBrand: '',
        placeOfInsertion: '',
        remarks: '',
      });
      setNewStents(updatedStents);
    } else {
      // You can optionally show a message to the user indicating that only 2 stents are allowed.
      alert('You can only add up to 2 stents.');
    }
  };

  const removeStent = (stentIndex) => {
    const updatedStents = [...newStents];
    updatedStents.splice(stentIndex, 1);
    setNewStents(updatedStents);
  };

  const submitStents = () => {
    axios
      .put(`http://localhost:5555/updateStentData/${id}`, newStents)
      .then((response) => {
        console.log('Stents added:', response.data);
        // Reset the form or update your local state
      })
      .catch((error) => {
        console.error('Error adding stents:', error);
        // Handle the error
      });
  };

  return (
    <div>
      <h2>Add Stent</h2>
      {newStents.map((stent, stentIndex) => (
        <div key={stentIndex}>
          <h3>Stent #{stentIndex + 1}</h3>
          <div className="form-group">
            <label>Laterality:</label>
            <input
              type="text"
              value={stent.laterality}
              onChange={(e) => handleInputChange(e, stentIndex, 'laterality')}
            />
          </div>
          <div className="form-group">
            <label>Hospital Name:</label>
            <input
              type="text"
              value={stent.hospitalName}
              onChange={(e) => handleInputChange(e, stentIndex, 'hospitalName')}
            />
          </div>
          <div className="form-group">
            <label>Inserted Date:</label>
            <input
              type="date"
              value={stent.insertedDate}
              onChange={(e) => handleInputChange(e, stentIndex, 'insertedDate')}
            />
          </div>
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={stent.dueDate}
              onChange={(e) => handleInputChange(e, stentIndex, 'dueDate')}
            />
          </div>
          <div className="form-group">
            <label>Size (fr):</label>
            <input
              type="number"
              value={stent.size}
              onChange={(e) => handleInputChange(e, stentIndex, 'size')}
            />
          </div>
          <div className="form-group">
            <label>Length (cm):</label>
            <input
              type="number"
              value={stent.length}
              onChange={(e) => handleInputChange(e, stentIndex, 'length')}
            />
          </div>
          <div className="form-group">
            <label>Stent Type:</label>
            <input
              type="text"
              value={stent.stentType}
              onChange={(e) => handleInputChange(e, stentIndex, 'stentType')}
            />
          </div>
          <div className="form-group">
            <label>Stent Brand:</label>
            <input
              type="text"
              value={stent.stentBrand}
              onChange={(e) => handleInputChange(e, stentIndex, 'stentBrand')}
            />
          </div>
          <div className="form-group">
            <label>Place of Insertion:</label>
            <input
              type="text"
              value={stent.placeOfInsertion}
              onChange={(e) => handleInputChange(e, stentIndex, 'placeOfInsertion')}
            />
          </div>
          <div className="form-group">
            <label>Remarks:</label>
            <input
              type="text"
              value={stent.remarks}
              onChange={(e) => handleInputChange(e, stentIndex, 'remarks')}
            />
          </div>
          {/* Add other stent fields similarly */}
          <button onClick={() => removeStent(stentIndex)}>Remove This Stent</button>
        </div>
      ))}
      <button onClick={addStent}>Add Another Stent</button>
      <button onClick={submitStents}>Submit Stents</button>
    </div>
  );
};

export default AddStent;
