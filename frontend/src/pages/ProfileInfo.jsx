import React, { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate,useLocation,Link  } from 'react-router-dom';
import { Image, Form,Container,Card,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
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

const ProfileInfo = () => {
 
  
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  
  const profileIcNo = location.state?.icNo || '';
  const profileRole = location.state?.role || '';
  
  const activeTab= location.state?.activeTab || '';
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
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

  const handleInputChange = (e) => {
    setIcNo(e.target.value);
  };

  const handleEditClick = () => {
    // Replace '/edit' with the actual path of your edit page
    if(profileRole === 'patient'){
        navigate('/profileInfo/edit', { state: { editIcNo: profileIcNo,editRole: profileRole } });
    }
    else{
        navigate('/profileInfo/edit', { state: { editIcNo: profileIcNo,editRole: profileRole} });
    }
  
  };

useEffect(()=>{
  const fetchUserData = async () => {
    try {
        let response;
        if(profileRole === 'patient'){
         response = await axios.get(`http://localhost:5555/getPatientByEmail/${profileIcNo}`);
         setUserInfo(response.data.patient);
        }
        else if(profileRole === 'admin'|| 'doctor'|| 'superAdmin') {
         response = await axios.get(`http://localhost:5555/getStaffByEmail/${profileIcNo}`);
         setUserInfo(response.data.staff);
        }
     else{
        console.log(profileRole);
     }


     
      
        console.log(userInfo);
        setErrorMessage('');
      
    } catch (error) {
      console.error(error);
      setUserInfo(null);
      setErrorMessage('Internal Server Error');
    }
  };
  fetchUserData();
},[navigate, profileIcNo]);


const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <div >
       
    <div>
      {userInfo && (
        <div>
        
          <Form>
            {profileRole === 'patient' ? (
              <>
                
                <>
               <br></br>

                <Container>
      <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header style={{ position: 'relative', display: 'inline-block' }}>
               
                <div >
                  <Image
                      src={`/MML.png`}
                    alt="Logo"
                    fluid
                    style={{ width: '100px', height: 'auto' }}
                    className="mx-auto d-block"
                  />
                </div>
              </Card.Header>

    <div className="card">
      <div className="card-body">
      
      <div className="text-center mb-3">
     
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Image
                  src={ userInfo.profilePic ? `/images/${userInfo.profilePic}` : '/images/DefaultProfilePic.jpg'}
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
                    onClick={() => openImageModal(userInfo.profilePic ? `/images/${userInfo.profilePic}` : '/images/DefaultProfilePic.jpg')}
                  />
                   
                </div>
                <h1 className='text-3xl my-4'>User Information 
                {/* <Link key={userInfo._id} to={`/profileEdit/${userInfo._id}`}><MdOutlineEdit  style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFA500' }} /></Link>  */}
                <MdOutlineEdit onClick={handleEditClick}  style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFA500' }} />
                 </h1>
              </div>
      
      
       
  <div className="row">
    
    <div className="col-md-4">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          placeholder="First Name"
          defaultValue={userInfo.firstName}
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
          defaultValue={userInfo.surname}
        //   onChange={(e) => setSurname(e.target.value)}
          className="form-control"
        />
      </div>

    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          placeholder="Date of Birth"
          defaultValue={formatDate(userInfo.dob)}
        //   onChange={(e) => setDob(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
  </div>
  <br></br>
  <div className="row">
    
    <div className="col-md-4">
      <div className="form-group">
        <label>MRN No:</label>
        <input
          type="text"
          placeholder="MRN No"
          defaultValue={userInfo.mrnNo}
        //   onChange={(e) => setIcNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>IC No:</label>
        <input
          type="text"
          placeholder="IC No"
          defaultValue={userInfo.icNo}
        //   onChange={(e) => setIcNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Gender</label>
        <select
          defaultValue={userInfo.gender}
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
    
    <div className="col-md-4">
      <div className="form-group">
        <label>Mobile Phone:</label>
        <input
          type="text"
          placeholder="Mobile Phone No"
          defaultValue={userInfo.mobileNo}
        //   onChange={(e) => setMobileNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          defaultValue={userInfo.email}
        //   onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Ethnicity:</label>
        <input
          type="ethnicity"
          placeholder="Ethnicity"
          defaultValue={userInfo.ethnicity}
        //   onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
   
    </div>
    <br></br>
     <div className="row">

     
   
  </div>
  
 
 
  
  <hr></hr>
  <h3>Next of Kin</h3>
  <div className="row">
   
  <div className="col-md-4">
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="nextOfKin.firstName"
          placeholder="Next of Kin First Name"
          defaultValue={userInfo.nextOfKin.firstName}
        //   onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Surname:</label>
        <input
          type="nextOfKin.surname"
          placeholder="Next of KIn Surname"
          defaultValue={userInfo.nextOfKin.surname}
        //   onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Next of Kin's Phone No:</label>
        <input
          type="nextOfKin.mobileNo"
          placeholder="Mobile No of Next of Kin"
          defaultValue={userInfo.nextOfKin.mobileNo}
        //   onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
   
    
  
   
    
   
  </div>
 

  
    
    
  
   

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
    <br></br>
              </>
              </>
            ) : (
              <>
               <br></br>

                <Container>
      <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header style={{ position: 'relative', display: 'inline-block' }}>
               
                <div >
                  <Image
                      src={`/MML.png`}
                    alt="Logo"
                    fluid
                    style={{ width: '100px', height: 'auto' }}
                    className="mx-auto d-block"
                  />
                </div>
              </Card.Header>

    <div className="card">
      <div className="card-body">
      
      <div className="text-center mb-3">
     
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Image
                    src={`/images/${userInfo.image}`}
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
                    onClick={() => openImageModal(`/images/${userInfo.image}`)}
                  />
                   
                </div>
                <h1 className='text-3xl my-4'>User Information 
                {/* <Link key={userInfo._id} to={`/profileEdit/${userInfo._id}`}><MdOutlineEdit  style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFA500' }} /></Link>  */}
                <MdOutlineEdit onClick={handleEditClick}  style={{ cursor: 'pointer', marginLeft: '10px', color: '#FFA500' }} />
                 </h1>
              </div>
      
      
       
  <div className="row">
    <div className="col-md-4">
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter Username"
          defaultValue={userInfo.username}
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
          defaultValue={userInfo.firstName}
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
          defaultValue={userInfo.surname}
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
          defaultValue={formatDate(userInfo.dob)}
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
          defaultValue={userInfo.icNo}
        //   onChange={(e) => setIcNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Gender</label>
        <select
          defaultValue={userInfo.gender}
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
          defaultValue={userInfo.address}
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
          defaultValue={userInfo.mobileNo}
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
          defaultValue={userInfo.email}
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
          defaultValue={userInfo.hospitalName}
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
          defaultValue={userInfo.department}
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
          defaultValue={userInfo.position}
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
          defaultValue={userInfo.mmcRegistrationNo}
        //   onChange={(e) => setMmcRegistrationNo(e.target.value)}
          className="form-control"
        />
      </div>
    </div>
   
    
    <div className="col-md-4">
 
    <div className="text-xl mr-4 text-gray-500">APC Certificate:</div>
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={`/images/${userInfo.imageSecond}`}
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
  onClick={() => openImageModal(`/images/${userInfo.imageSecond}`)}
/>
    </div>
  
  </div>
  </div>
 

  
    
    
  
   

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
    <br></br>
              </>
            )}
          </Form>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  </div>
  );
};

export default ProfileInfo;
