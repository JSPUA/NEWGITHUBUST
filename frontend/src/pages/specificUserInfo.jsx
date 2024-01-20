import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,Link,useNavigate,useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { faSearchPlus, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Container,Card,Image } from 'react-bootstrap';

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

const SpecificUserInfo = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessApproveModal, setShowSuccessApproveModal] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    
    axios
      .get(`http://localhost:5555/user/${id}`)
      .then((response) => {
        setUser(response.data);
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

 

 

  return (
    <div className='p-4'>
      <BackButton />
      {/* <h1 className='text-3xl my-4'>Application Information</h1> */}
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          {/*  here is picture  */}
        
         
{/* until here */}


        


      <Container>
      <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                <Link to="/login">  <FontAwesomeIcon icon={faAngleLeft} /></Link> Back
                </div>
                <div className="text-center">
                  <Image
                      src={`/MML.png`}
                    alt="Logo"
                    fluid
                    style={{ width: '100px', height: 'auto' }}
                    className="mx-auto"
                  />
                </div>
              </Card.Header>
    <div className="card">
      <div className="card-body">
      <form  className="mb-3">
      <h1 className='text-3xl my-4'>User Information</h1>
       
       
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter Username"
          defaultValue={user.username}
        //   onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          placeholder="First Name"
          defaultValue={user.firstName}
        //   onChange={(e) => setFirstName(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Surname:</label>
        <input
          type="text"
          placeholder="Surname"
          defaultValue={user.surname}
        //   onChange={(e) => setSurname(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
  </div>
  <br></br>
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          placeholder="Date of Birth"
          defaultValue={formatDate(user.dob)}
        //   onChange={(e) => setDob(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>IC No:</label>
        <input
          type="number"
          placeholder="IC No"
          defaultValue={user.icNo}
        //   onChange={(e) => setIcNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Gender</label>
        <select
          defaultValue={user.gender}
        //   onChange={(e) => setGender(e.target.value)}
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
    <div className="col-md-6">
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          placeholder="Address"
          defaultValue={user.address}
        //   onChange={(e) => setAddress(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label>Mobile Phone:</label>
        <input
          type="text"
          placeholder="Mobile Phone No"
          defaultValue={user.mobileNo}
        //   onChange={(e) => setMobileNo(e.target.value)}
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
          defaultValue={user.email}
        //   onChange={(e) => setEmail(e.target.value)}
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
          defaultValue={user.hospitalName}
        //   onChange={(e) => setHospitalName(e.target.value)}
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
          defaultValue={user.department}
        //   onChange={(e) => setDepartment(e.target.value)}
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
          defaultValue={user.position}
        //   onChange={(e) => setPosition(e.target.value)}
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
          defaultValue={user.mmcRegistrationNo}
        //   onChange={(e) => setMmcRegistrationNo(e.target.value)}
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
  </div>

    
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
       
        </div>
      )}
      
      
    </div>
  );
};

export default  SpecificUserInfo;
