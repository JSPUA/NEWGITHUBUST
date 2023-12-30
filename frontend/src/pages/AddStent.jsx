import React, { useState } from 'react';
import axios from 'axios';

const AddStentRecord = () => {
  const [formData, setFormData] = useState({
    mrnNo: '',
    stentData: [
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
    ],
  });

  const [usedMrnNumbers, setUsedMrnNumbers] = useState([]);

  const handleInputChange = (e, stentIndex, fieldName) => {
    const updatedStentData = [...formData.stentData];
    updatedStentData[stentIndex][fieldName] = e.target.value;

    setFormData({
      ...formData,
      stentData: updatedStentData,
    });
  };

  const addStentRow = () => {
    if (formData.stentData.length < 2) {
    setFormData({
      ...formData,
      stentData: [
        ...formData.stentData,
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
      ],
    });
}
  };

  const removeStentRow = (stentIndex) => {
    if (formData.stentData.length > 1) {
    const updatedStentData = formData.stentData.filter((_, i) => i !== stentIndex);
    setFormData({
      ...formData,
      stentData: updatedStentData,
    });
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       
        if (usedMrnNumbers.includes(formData.mrnNo)) {
            console.error('MRN No already used.');
            return;
          }
    
        
      const response = await axios.post('http://localhost:5555/stentRecords', formData);
      console.log('Stent record added:', response.data);

      setUsedMrnNumbers([...usedMrnNumbers, formData.mrnNo]);
      // You can add further actions after a successful submission, e.g., redirect to a different page.
    } catch (err) {
      console.error('Error adding stent record:', err);
    }
  };

  return (
    <div>
      <h2>Add Stent Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>MRN No:</label>
          <input
            type="text"
            name="mrnNo"
            value={formData.mrnNo}
            onChange={(e) => setFormData({ ...formData, mrnNo: e.target.value })}
            required
          />
        </div>
        {formData.stentData.map((stent, stentIndex) => (
          <div key={stentIndex}>
            <h3>Stent #{stentIndex + 1}</h3>
            
            {/* Add more input fields for stent data */}
            <div className="form-group">
              <label>Laterality:</label>
              <input
                type="text"
                name="laterality"
                value={stent.laterality}
                onChange={(e) => handleInputChange(e, stentIndex, 'laterality')}
              />
            </div>
            <div className="form-group">
              <label>Inserted in Hospital:</label>
              <input
                type="text"
                name="hospitalName"
                value={stent.hospitalName}
                onChange={(e) => handleInputChange(e, stentIndex, 'hospitalName')}
              />
            </div>
            <div className="form-group">
              <label>Inserted Date:</label>
              <input
                type="date"
                name="insertedDate"
                value={stent.insertedDate}
                onChange={(e) => handleInputChange(e, stentIndex, 'insertedDate')}
              />
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={stent.dueDate}
                onChange={(e) => handleInputChange(e, stentIndex, 'dueDate')}
              />
            </div>
            <div className="form-group">
              <label>Size:</label>
              <input
                type="text"
                name="size"
                value={stent.size}
                onChange={(e) => handleInputChange(e, stentIndex, 'size')}
              />
            </div>
            <div className="form-group">
              <label>Length:</label>
              <input
                type="text"
                name="length"
                value={stent.length}
                onChange={(e) => handleInputChange(e, stentIndex, 'length')}
              />
            </div>
            <div className="form-group">
              <label>Stent Type:</label>
              <input
                type="text"
                name="stentType"
                value={stent.stentType}
                onChange={(e) => handleInputChange(e, stentIndex, 'stentType')}
              />
            </div>
            <div className="form-group">
              <label>Stent Brand:</label>
              <input
                type="text"
                name="stentBrand"
                value={stent.stentBrand}
                onChange={(e) => handleInputChange(e, stentIndex, 'stentBrand')}
              />
            </div>
            <div className="form-group">
              <label>Place of Insertion:</label>
              <input
                type="text"
                name="placeOfInsertion"
                value={stent.placeOfInsertion}
                onChange={(e) => handleInputChange(e, stentIndex, 'placeOfInsertion')}
              />
            </div>
            <div className="form-group">
              <label>Remarks:</label>
              <input
                type="text"
                name="remarks"
                value={stent.remarks}
                onChange={(e) => handleInputChange(e, stentIndex, 'remarks')}
              />
            </div>
            {/* Add other stent data input fields similarly */}
            {formData.stentData.length < 2 && (
            <button type="button" onClick={addStentRow}>
              Add Another Stent
            </button>
              )}
            {formData.stentData.length > 1 && (
              <button type="button" onClick={() => removeStentRow(stentIndex)}>
                Remove This Stent
              </button>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddStentRecord;
