// src/components/ShowPicture.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowPicture = () => {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/pictures');
        setPictures(response.data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };
    fetchPictures();
  }, []);

  return (
    <div>
      <h2>Picture Gallery</h2>
      <ul>
        {pictures.map((picture) => (
          <li key={picture._id}>
            <img src={`/uploads/${picture.imageUrl}`} alt={picture.title} />
            <h3>{picture.title}</h3>
            <p>{picture.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowPicture;
