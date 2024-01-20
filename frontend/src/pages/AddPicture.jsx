// src/components/AddPicture.js
import React, { useState } from 'react';
import axios from 'axios';
import { Modal,Button } from 'react-bootstrap';

const AddPicture = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5555/api/pictures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedImage(response.data.image);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding picture:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div>
      <h2>Add Picture</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" name="image" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Add Picture</button>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your picture has been successfully uploaded.
          {/* You can add more details or links here if needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPicture;
