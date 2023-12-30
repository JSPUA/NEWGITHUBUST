// src/components/DeletePicture.js
import React from 'react';
import axios from 'axios';

const DeletePicture = ({ pictureId }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/pictures/${pictureId}`);
      // Handle success, e.g., remove the picture from the gallery
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

export default DeletePicture;
