

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { faAngleLeft,faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Card, Image, Button,Modal } from 'react-bootstrap';


function formatDate(isoDate) {
  if (!isoDate) {
    return '';
  }
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const UpdateUser = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [fileInputRef] = useState(React.createRef());
  const [updateData, setUpdateData] = useState({
    username: '',
    firstName: '',
    surname: '',
    dob: '',
    icNo: '',
    gender: '',
    address: '',
    mobileNo: '',
    email: '',
    hospitalName: '',
    department: '',
    position: '',
    mmcRegistrationNo: '',
    image: null, // Add default values for image fields
    imageSecond: null,
    // Add other fields as needed
  });

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:5555/user/${id}`)
      .then((response) => {
        setUser(response.data);
        setUpdateData({
          username: response.data.username,
          firstName: response.data.firstName,
          surname: response.data.surname,
          dob: formatDate(response.data.dob),
          icNo: response.data.icNo,
          gender: response.data.gender,
          address: response.data.address,
          mobileNo: response.data.mobileNo,
          email: response.data.email,
          hospitalName: response.data.hospitalName,
          department: response.data.department,
          position: response.data.position,
          mmcRegistrationNo: response.data.mmcRegistrationNo,
          image: null, // Initialize image fields with null
          imageSecond: null,
          // Add other fields as needed
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    setUpdateData((prevData) => ({
      ...prevData,
      [imageType]: file,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      // Append other form data
      formData.append('username', updateData.username);
      formData.append('firstName', updateData.firstName);
      formData.append('surname', updateData.surname);
      formData.append('dob', updateData.dob);
      formData.append('icNo', updateData.icNo);
      formData.append('gender', updateData.gender);
      formData.append('address', updateData.address);
      formData.append('mobileNo', updateData.mobileNo);
      formData.append('email', updateData.email);
      formData.append('hospitalName', updateData.hospitalName);
      formData.append('department', updateData.department);
      formData.append('position', updateData.position);
      formData.append('mmcRegistrationNo', updateData.mmcRegistrationNo);

      if (updateData.image) {
        formData.append('image', updateData.image);
      }
      if (updateData.imageSecond) {
        formData.append('imageSecond', updateData.imageSecond);
      }

      // Send a PUT request to update the user information
      await axios.put(`http://localhost:5555/user/${id}`, formData);

      // Optionally, you can fetch the updated user information and update the state
      const response = await axios.get(`http://localhost:5555/user/${id}`);
      setUser(response.data);

      setLoading(false);
      // Show success modal or handle success in another way
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Handle error, show error message, etc.
    }

   
  };

  return (
    <div className='p-4'>
      <BackButton />
      {loading ? (
        <Spinner />
      ) : (
        <Container>
          <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header className='d-flex justify-content-between align-items-center'>
              <div>
                <Link to='/login'>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Link>{' '}
                Back
              </div>
              <div className='text-center'>
                <Image src={`/MML.png`} alt='Logo' fluid style={{ width: '100px', height: 'auto' }} className='mx-auto' />
              </div>
            </Card.Header>
            <div className='card'>
              <div className='card-body'>
                <form className='mb-3' onSubmit={handleFormSubmit}>
                  <h1 className='text-3xl my-4'>User Information</h1>
                  {/* ... rest of your form fields ... */}
                  {/* Example input field, repeat for other fields */}
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label>Username:</label>
                        <input
                          type='text'
                          name='username'
                          placeholder='Enter Username'
                          value={updateData.username}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label>First Name:</label>
                        <input
                          type='text'
                          name='firstName'
                          placeholder='Enter First Name'
                          value={updateData.firstName}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label>Surname:</label>
                        <input
                          type='text'
                          name='surname'
                          placeholder='Enter surname'
                          value={updateData.surname}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>
                    </div>
                    </div>
                    <br></br>
                    <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label>Date of Birth:</label>
                        <input
                          type='date'
                          name='dob'
                          placeholder='Enter Birthday'
                          value={updateData.dob}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>
                      </div>
                      <div className='col-md-4'>
                      <div className='form-group'>
                        <label>IC No:</label>
                        <input
                          type='number'
                          name='icNo'
                          placeholder='Enter IcNO'
                          value={updateData.icNo}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>

                      </div>
                      <div className="col-md-4">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={updateData.gender}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              </div>
                   
                    {/* ... repeat for other fields ... */}
                  </div>
                  <br></br>
                  <div className="row">
                  <div className='col-md-4'>
                      <div className='form-group'>
                        <label>Address:</label>
                        <input
                          type='text'
                          name='address'
                          placeholder='Enter Address'
                          value={updateData.address}
                          onChange={handleInputChange}
                          className='form-control'
                        />
                      </div>

                      </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Mobile Phone No (Include +60 in No):</label>
        <input
      type="text"
      name='mobileNo'
      placeholder="Mobile Phone No (Include +60 in No)"
      value={updateData.mobileNo}
      onChange={handleInputChange}
      className="form-control"
    />
      </div>
    </div>
  </div>
  <br></br>
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={updateData.email}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Name of Hospital:</label>
        <input
          type="text"
          placeholder="Hospital Name"
          defaultValue={updateData.hospitalName}
          readOnly
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Department:</label>
        <input
          type="text"
          placeholder="Department"
          defaultValue={updateData.department}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
  </div>
  <br></br>
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Position:</label>
        <input
          type="text"
          placeholder="Position"
          defaultValue={updateData.position}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
   
    
  
    <div className="col-md-4">
      <div className="form-group">
        <label>MMC Registration No:</label>
        <input
          type="text"
          placeholder="MMC Registration No"
          defaultValue={updateData.mmcRegistrationNo}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
   
    <div className="col-md-4">
 
 <div className="text-xl mr-4 text-gray-500">APC Certificate:</div>
 <div style={{ position: 'relative', display: 'inline-block' }}>
   <img
     src={`/images/${user.imageSecond}`}
     alt="APC Certificate"
     width={130}
     height={100}
   />
    <img
src="/magnifier.png"
alt="Custom Magnifier"
width={20}
height={20}

style={{
 position: 'absolute',
 bottom: 0,
 right: 0,
}}
onClick={() => openImageModal(`/images/${user.imageSecond}`)}
/>
 </div>

</div>
    <div className="col-md-4">
            <div className="form-group">
              <label>Update Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'image')}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>Update APC Certificate:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'imageSecond')}
                className="form-control"
              />
            </div>
          </div>

         
        
  </div>
  <br></br>
                  <Button type='submit' variant='primary'>
                    Update User
                  </Button>

                  <div className="profile-photo-container">
  <div > 
  <div className='text-xl text-gray-500' style={{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'left' }}>Profile Picture:</div>
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <img
      src={`/images/${user.image}`}
      alt='Profile Image'
      width={80}
      height={100}
    />
    <img
  src="/magnifier.png"
  alt="Custom Magnifier"
  width={20}
  height={20}
 
  style={{
    position: 'absolute',
    bottom: 0,
    right: 0,
  }}
  onClick={() => openImageModal(`/images/${user.image}`)}
/>
    </div>
  </div>
</div>
                </form>
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{
                    fontSize: '3rem',
                    color: 'orange',
                    marginBottom: '1rem',
                  }}
                />
                <p>You have successfully updated the patient's information.</p>
              </Modal.Body>
              <Modal.Footer>
              <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/user-list', { state: { hospitalName: updateData.hospitalName } }); // Redirect to /showPatient
            }}
          >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showImageModal} onHide={closeImageModal}>
        <Modal.Header closeButton>
          
        </Modal.Header >
        <Modal.Body >
          <img
            src={modalImage}
            alt='Enlarged Image'
            style={{ width: '100%', height: '100%' }}
          />
        </Modal.Body>
        
      </Modal>
              </div>
            </div>
          </Card>
        </Container>
      )}
    </div>
  );
};

export default UpdateUser;
