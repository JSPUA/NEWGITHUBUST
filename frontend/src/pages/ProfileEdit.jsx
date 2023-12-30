import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate,useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { faAngleLeft,faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Card, Image, Button,Modal } from 'react-bootstrap';
import { MdOutlineEdit } from 'react-icons/md';

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

const ProfileEdit = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
 const icNo =location.state.editIcNo;
 const role = location.state.editRole;
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
    mrnNo: '',
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
    ethnicity: '',
    profilePic: null,
    nextOfKin: {
        firstName: '',
        surname: '',
        mobileNo: '',
      },

    // Add other fields as needed
  });

  useEffect(() => {
    setLoading(true);

    let url;
    if (role === 'admin' || role === 'superAdmin' || role === 'doctor') {
      url = `http://localhost:5555/getStaffInfo/${icNo}`;
    } else if (role === 'patient') {
      url = `http://localhost:5555/getPatientByEmail/${icNo}`; // Replace with the actual patient API URL
    } else {
      // Handle unexpected role
      console.error("Invalid role:", role);
      setLoading(false);
      return;
    }

    axios
      .get(url)
      .then((response) => {
        setUser(response.data.staff || response.data.patient);
        console.log(response.data.staff|| response.data.patient);
        if(role === 'admin' || role === 'superAdmin' || role === 'doctor' ){
        setUpdateData({
            id: response.data.staff._id,
          username: response.data.staff.username,
          firstName: response.data.staff.firstName,
          surname: response.data.staff.surname,
          dob: formatDate(response.data.staff.dob),
          icNo: response.data.staff.icNo,
          gender: response.data.staff.gender,
          address: response.data.staff.address,
          mobileNo: response.data.staff.mobileNo,
          email: response.data.staff.email,
          hospitalName: response.data.staff.hospitalName,
          department: response.data.staff.department,
          position: response.data.staff.position,
          mmcRegistrationNo: response.data.staff.mmcRegistrationNo,
          image: null, // Initialize image fields with null
          imageSecond: null,
          // Add other fields as needed
        });}
        else if (role === 'patient'){
            setUpdateData({
                id: response.data.patient._id,
             
              firstName: response.data.patient.firstName,
              surname: response.data.patient.surname,
              dob: formatDate(response.data.patient.dob),
              icNo: response.data.patient.icNo,
              mrnNo: response.data.patient.mrnNo,
              gender: response.data.patient.gender,
              address: response.data.patient.address,
              mobileNo: response.data.patient.mobileNo,
              email: response.data.patient.email,
              ethnicity: response.data.patient.ethnicity,
              profilePic: response.data.patient.profilePic,
              nextOfKin:{
                firstName: response.data.patient.nextOfKin.firstName,
                surname: response.data.patient.nextOfKin.surname,
                mobileNo: response.data.patient.nextOfKin.mobileNo
              }
             });
             console.log(response.data.patient.nextOfKin.firstName);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [icNo]);

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nextOfKin.")) {
        const key = name.split(".")[1]; // Get the key after 'nextOfKin.'
        setUpdateData((prevData) => ({
            ...prevData,
            nextOfKin: {
                ...prevData.nextOfKin,
                [key]: value,
            },
        }));
    } else {
        setUpdateData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
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
if(role === 'admin' || role === 'superAdmin' || role === 'doctor' ){
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
      await axios.put(`http://localhost:5555/user/${updateData.id}`, formData);

      // Optionally, you can fetch the updated user information and update the state
      const response = await axios.get(`http://localhost:5555/user/${updateData.id}`);
      setUser(response.data);
    }
    else if (role === 'patient'){
       
      formData.append('firstName', updateData.firstName);
      formData.append('surname', updateData.surname);
      formData.append('dob', updateData.dob);
      formData.append('mrnNo', updateData.mrnNo);
      formData.append('icNo', updateData.icNo);
      formData.append('gender', updateData.gender);
      formData.append('mobileNo', updateData.mobileNo);
      formData.append('email', updateData.email);
      formData.append('ethnicity', updateData.ethnicity);
      formData.append('nextOfKin[firstName]', updateData.nextOfKin.firstName);
      formData.append('nextOfKin[surname]', updateData.nextOfKin.surname);
      formData.append('nextOfKin[mobileNo]', updateData.nextOfKin.mobileNo);
      if (updateData.profilePic) {
        formData.append('profilePic', updateData.profilePic);
      }
      await axios.put(`http://localhost:5555/updatePatientInfo/${icNo}`, formData);

      const response = await axios.get(`http://localhost:5555/getPatientById/${updateData.id}`);
      setUser(response.data);
    }
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
    role === 'admin' || role === 'superAdmin' || role === 'doctor' ? (
        <Container>
        <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Card.Header style={{ position: 'relative', display: 'inline-block' }}>
           
            <div className='text-center'>
              <Image src={`/MML.png`} alt='Logo' fluid style={{ width: '100px', height: 'auto' }} className="mx-auto d-block" />
            </div>
          </Card.Header>
          <div className='card'>
            <div className='card-body'>
              <form className='mb-3' onSubmit={handleFormSubmit}>
              <div className="text-center mb-3">
                <div style={{ position: 'relative', display: 'inline-block' }}>
       <Image
         src={ `/images/${user.image}` || '/images/DefaultProfilePic.jpg'}
         alt='Profile Image'
         roundedCircle
         width={120}
         height={120}
         className="mx-auto d-block"
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
     <h1 className='text-3xl my-4'>User Information Edit</h1>
     </div>
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
        name="department"
        placeholder="Department"
        value={updateData.department}
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
        name="position"
        placeholder="Position"
        value={updateData.position}
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
        name="mmcRegistrationNo"
        placeholder="MMC Registration No"
        value={updateData.mmcRegistrationNo}
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

<hr></hr>
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
<div className="d-flex justify-content-end" >  <Button type='submit' variant='primary' >
                  Update User
                </Button></div>

               
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
            navigate('/profileInfo', { state: { icNo: updateData.icNo, role: updateData.position||'patient' } }); // Redirect to /showPatient
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
    ) : role === 'patient' ? (
     <Container>
          <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header style={{ position: 'relative', display: 'inline-block' }}>
             
              <div className='text-center'>
                <Image src={`/MML.png`} alt='Logo' fluid style={{ width: '100px', height: 'auto' }} className="mx-auto d-block" />
              </div>
            </Card.Header>
            <div className='card'>
              <div className='card-body'>
                <form className='mb-3' onSubmit={handleFormSubmit}>
                 
                  <div className="text-center mb-3">
     
     <div style={{ position: 'relative', display: 'inline-block' }}>
       <Image
          src={ updateData.profilePic ? `/images/${updateData.profilePic}` : '/images/DefaultProfilePic.jpg'}
         alt='Profile Image'
         roundedCircle
         width={120}
         height={120}
         className="mx-auto d-block"
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
         onClick={() => openImageModal(updateData.profilePic ? `/images/${updateData.profilePic}` : '/images/DefaultProfilePic.jpg')}
       />
        
     </div>
     <h1 className='text-3xl my-4'>User Information Edit
     {/* <Link key={userInfo._id} to={`/profileEdit/${userInfo._id}`}><MdOutlineEdit  style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFA500' }} /></Link>  */}
    
      </h1>
   </div>
                  <div className='row'>
                    
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
                    </div>
                    <br></br>
                    <div className='row'>
                    <div className="col-md-4">
      <div className="form-group">
        <label>MRN No:</label>
        <input
          type="text"
          name='mrnNo'
          placeholder="mrnNo"
          value={updateData.mrnNo}
          onChange={handleInputChange}
          className="form-control"
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
                   
                   
                  </div>
                  <br></br>
                  <div className="row">
                 
    <div className="col-md-4">
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
    <div className="col-md-4">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={updateData.email}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Ethnicity:</label>
        <input
          type="text"
          name="ethnicity"
          placeholder="Ethnicity"
         value={updateData.ethnicity}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
  </div>
  <br></br>
  <hr></hr>
  <h3>Next of Kin</h3>
   <div className="row">
   
  <div className="col-md-4">
      <div className="form-group">
      <label>Next of Kin first Name:</label>
        <input
          type="text"
          name="nextOfKin.firstName"
          placeholder="Ethnicity"
         value={updateData.nextOfKin.firstName}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Surname:</label>
        <input
          type="text"
          name="nextOfKin.surname"
          placeholder="Next of KIn Surname"
          value={updateData.nextOfKin.surname}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Next of Kin's Phone No:</label>
        <input
          type="text"
          name="nextOfKin.mobileNo"
          placeholder="Mobile No of Next of Kin"
         value={updateData.nextOfKin.mobileNo}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
   </div> 
    
  
  <br></br>
  <hr></hr>
  
  <div className="row">
 
    <div className="col-md-4">
            <div className="form-group">
              <label>Update Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profilePic')}
                className="form-control"
              />
            </div>
          </div>
         
         
        
  </div>
  <br></br>
  <div className="d-flex justify-content-end" >      <Button type='submit' variant='primary' >
                    Update User
                  </Button></div>

                  <div className="profile-photo-container">
  <div > 
  
  
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
              navigate('/profileInfo', { state: { icNo: updateData.icNo, role: updateData.position ||'patient'} }); // Redirect to /showPatient
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
    ) : null
  )}
    </div>

  );
};

export default ProfileEdit;

