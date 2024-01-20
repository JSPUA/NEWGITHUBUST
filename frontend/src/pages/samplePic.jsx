import React, { useState } from "react";

function PictureApp() {
  const [pictures, setPictures] = useState([]);
  const [id, setId] = useState(1);
  const [currentPicture, setCurrentPicture] = useState({
    id: null,
    title: "",
    imageUrl: "",
  });

  const addPicture = () => {
    setPictures([
      ...pictures,
      {
        id: id,
        title: currentPicture.title,
        imageUrl: currentPicture.imageUrl,
      },
    ]);
    setId(id + 1);
    setCurrentPicture({
      id: null,
      title: "",
      imageUrl: "",
    });
  };

  const editPicture = (id) => {
    const pictureToEdit = pictures.find((picture) => picture.id === id);
    setCurrentPicture({ ...pictureToEdit });
  };

  const updatePicture = () => {
    const updatedPictures = pictures.map((picture) =>
      picture.id === currentPicture.id ? currentPicture : picture
    );
    setPictures(updatedPictures);
    setCurrentPicture({
      id: null,
      title: "",
      imageUrl: "",
    });
  };

  const deletePicture = (id) => {
    const updatedPictures = pictures.filter((picture) => picture.id !== id);
    setPictures(updatedPictures);
  };

  return (
    <div>
      <h1>Picture Management</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={currentPicture.title}
          onChange={(e) =>
            setCurrentPicture({ ...currentPicture, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={currentPicture.imageUrl}
          onChange={(e) =>
            setCurrentPicture({ ...currentPicture, imageUrl: e.target.value })
          }
        />
        {currentPicture.id ? (
          <button onClick={updatePicture}>Update</button>
        ) : (
          <button onClick={addPicture}>Add</button>
        )}
      </div>
      <ul>
        {pictures.map((picture) => (
          <li key={picture.id}>
            <img src={picture.imageUrl} alt={picture.title} />
            <div>{picture.title}</div>
            <button onClick={() => editPicture(picture.id)}>Edit</button>
            <button onClick={() => deletePicture(picture.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PictureApp;
