// src/components/UpdatePicture.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdatePicture = ({ picture }) => {
  const [title, setTitle] = useState(picture.title);
  const [description, setDescription] = useState(picture.description);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`/api/pictures/${picture._id}`, formData);
      // Handle success, e.g., redirect to picture gallery
    } catch (error) {
      console.error('Error updating picture:', error);
    }
  };

  return (
    <div>
      <h2>Edit Picture</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default UpdatePicture;
