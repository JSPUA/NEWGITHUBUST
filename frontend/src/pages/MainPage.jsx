import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar, Nav, NavDropdown,Form,Image ,Button,Table,Container,Col,Row} from 'react-bootstrap';
import axios from 'axios';
import AnimatedCountdown from "./AnimatedCountdown";


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

function countdown( dueDate){
  if (dueDate === "permanent") {
    return {
      expired: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      countdownValue: 0,     
     };
  }

  const dueDateTime = new Date(dueDate);
  const currentTime = new Date();
  const timeRemaining = dueDateTime - currentTime;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
   

    return {
      expired: false,
      days,
      
    };
  } else {
    return {
      expired: true,
      days: 0,
      
    };
  }
}


const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [patientRoleData, setPatientRoleData] = useState(null);
  const { email,icNo } = useParams();
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  let profileImageSrc = '/images/DefaultProfilePic.jpg';
  
  // const{activeTab}=useParams();
  const isPermissionInRole = (permission) => {
    return roleData ? roleData.permissions.includes(permission) : (patientRoleData && patientRoleData.permissions.includes(permission));
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5555/logout');
      if (response.data.success) {
        // Redirect to the login page or perform any other necessary actions
        navigate('/login');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const calculateColor = (dayLeft) => {
    if (dayLeft > 14) {
    
      return 'green';
      
    } else if (dayLeft > 0) {
    
      return 'yellow';
    } else {
     
      return 'red';
    }
  };

  const handleShowPatientList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate('/patient-list', { state: { hospitalName: userData.hospitalName } });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error('Error: userData or hospitalName not available');
    }
  };

  const handleShowUserList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate('/user-list', { state: { hospitalName: userData.hospitalName } });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error('Error: userData or hospitalName not available');
    }
  };

  const handleShowApplicationList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate('/application-list', { state: { hospitalName: userData.hospitalName } });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error('Error: userData or hospitalName not available');
    }
  };

  const handleProfileClick = () => {
    // Assuming you want to navigate to the '/profile' route
    if(location.state.activeTab === 'staff'){
      navigate('/profileInfo', { state: { icNo: userData.icNo, role: roleData.name,activeTab: location.state.activeTab  } });
    }
    else if(location.state.activeTab === 'patient'){
      navigate('/profileInfo', { state: { icNo: userData.icNo, role: "patient" ,activeTab: location.state.activeTab} });
    }
   
  };

  useEffect(() => {
    const fetchHospitalNames = async () => {
      try {
        const response = await fetch('http://localhost:5555/hospitalsP');
        const data = await response.json();
        setHospitalNames(data.hospitals);
      } catch (error) {
        console.error('Error fetching hospital names:', error);
      }
    };

    fetchHospitalNames();
   
  }, []);

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  

  useEffect(() => {
    // Fetch additional user data based on the stored token or user information
    const fetchUserData = async () => {
      try {
        console.log(location.state.icNo);
        console.log(location.state.activeTab);
        
        // You should ideally send the authentication token with the request
        // For simplicity, assuming the server knows the user based on the token
        let endpoint = '';
        if (location.state.activeTab === 'staff') {
          endpoint = `http://localhost:5555/getStaffByEmail/${location.state.icNo}`;
        } else if (location.state.activeTab === 'patient') {
          endpoint = `http://localhost:5555/getPatientByEmail/${location.state.icNo}`;
        } else {
          // Handle other cases or show an error
          console.error('Invalid user type:', location.state.activeTab);
          // Redirect to login or handle the error as needed
          navigate('/login');
          return;
        }
  
        const response = await axios.get(endpoint, {
          // headers: { Authorization: `Bearer ${yourAuthToken}` },
        });
  

        if (location.state.activeTab === 'staff') {
          setUserData(response.data.staff); // Change from 'user' to 'patient' based on your server response
          const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
          setRoleData(roleResponse.data);
       

          
        }
        else if(location.state.activeTab === 'patient'){
          setUserData(response.data.patient);
          const patientRoleResponse = await axios.get(`http://localhost:5555/role/patient`);
          setPatientRoleData(patientRoleResponse.data);
          
        }
        
        else {
          // Handle other cases or show an error
          console.error('Invalid user type:', location.state.activeTab);
          // Redirect to login or handle the error as needed
          navigate('/login');
          return;
        }
       // Default image


        
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., redirect to login)
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate, icNo]); // Combine both dependencies in a single array

  const calculateDueDate = (insertedDate, dueIn) => {
    if (!insertedDate) {
      return '';
    }
  
    // Convert the dueIn value to the number of days
    let days = 0;
    switch (dueIn) {
      case '2 weeks':
        days = 14;
        break;
      case '1 month':
        days = 30;
        break;
      case '2 months':
        days = 60;
        break;
      case '3 months':
        days = 90;
        break;
      case '6 months':
        days = 180;
        break;
      case '12 months':
        days = 365; // Approximated to 365 days for a year
        break;
      case 'permanent':
        days = 0;
        break;
      default:
        days = 0;
    }
  
    // Calculate the due date by adding the number of days to the inserted date
    const insertedDateTime = new Date(insertedDate).getTime();
    const dueDateTime = new Date(insertedDateTime + days * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDateTime.toISOString().split('T')[0];
  
    return formattedDueDate;
  };

  return (
    
    <div>
    
     {userData ? (
        <>
       { (location.state && location.state.activeTab==="patient")||userData.position==="admin"||userData.position==="doctor" ?(
       <>
        <Navbar bg="light"  expand="lg" >
                <Navbar.Brand href="#"><Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/mainPage">Home</Nav.Link>
                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
        {isPermissionInRole('addPatient') && <NavDropdown.Item href="/addPatient">Add Patients</NavDropdown.Item>}
        {isPermissionInRole('viewPatient') && <NavDropdown.Item href="/showPatient">View Patients</NavDropdown.Item>}
        {isPermissionInRole('editPatient') && <NavDropdown.Item href="#">Edit Patients</NavDropdown.Item>}
        {isPermissionInRole('deletePatient') && <NavDropdown.Item href="#">Delete Patients</NavDropdown.Item>}
      </NavDropdown>
                         )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && <NavDropdown.Item href="/researchList">View Research</NavDropdown.Item>}
        {isPermissionInRole('addResearch') && <NavDropdown.Item href="/uploadPDF">Add Research</NavDropdown.Item>}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Stents" id="nav-stents-dropdown">
        {isPermissionInRole('addStent') && <NavDropdown.Item href="#">Add Stent</NavDropdown.Item>}
        {isPermissionInRole('myStentRecord') && <NavDropdown.Item href="#">My Stent Record</NavDropdown.Item>}
      </NavDropdown>
      )}

      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}
    </Nav>
                       
                  
                    
                </Navbar.Collapse>
                
       <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      <Nav>
        <NavDropdown
          title={
            <img
            src={`/images/${(location.state.activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
            alt='Profile Image'
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: '2px solid #fff',
            }}
          />
          }
          id="collasible-nav-dropdown"
          className="custom-dropdown" // Add a custom class for styling
        >
          <NavDropdown.Item onClick={handleProfileClick} >Your Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
            </Navbar>
       </>
       ): userData.position==="superAdmin"?(
       <>
       <Navbar bg="light"  expand="lg" >
                <Navbar.Brand href="#"><Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/mainPage">Home</Nav.Link>
                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
        {isPermissionInRole('addPatient') && <NavDropdown.Item href="/addPatient">Add Patients</NavDropdown.Item>}
        {isPermissionInRole('viewPatient') && <NavDropdown.Item href="/showPatient">View Patients</NavDropdown.Item>}
        {isPermissionInRole('editPatient') && <NavDropdown.Item href="#">Edit Patients</NavDropdown.Item>}
        {isPermissionInRole('deletePatient') && <NavDropdown.Item href="#">Delete Patients</NavDropdown.Item>}
      </NavDropdown>
                         )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && <NavDropdown.Item href="/researchList">View Research</NavDropdown.Item>}
        {isPermissionInRole('addResearch') && <NavDropdown.Item href="/uploadPDF">Add Research</NavDropdown.Item>}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Stents" id="nav-stents-dropdown">
        {isPermissionInRole('addStent') && <NavDropdown.Item href="#">Add Stent</NavDropdown.Item>}
        {isPermissionInRole('myStentRecord') && <NavDropdown.Item href="#">My Stent Record</NavDropdown.Item>}
      </NavDropdown>
      )}
      
      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}
                        {/* Add other navigation links based on permissions */}
                        <NavDropdown title={selectedHospital || 'Select Hospital'} id="basic-nav-dropdown">
                        <NavDropdown.Item key="all-hospitals" onClick={() => handleHospitalSelect('All Hospitals')}>
    All Hospitals
  </NavDropdown.Item>
  {hospitalNames.map((hospital, index) => (
    <NavDropdown.Item key={index} onClick={() => handleHospitalSelect(hospital)}>
      {hospital}
    </NavDropdown.Item>
  ))}
          </NavDropdown>
                    </Nav>
                    
                </Navbar.Collapse>
                
       <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      <Nav>
        <NavDropdown
          title={
            <img
            src={`/images/${(location.state.activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
            alt='Profile Image'
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              border: '2px solid #fff',
            }}
          />
          }
          id="collasible-nav-dropdown"
          className="custom-dropdown" // Add a custom class for styling
        >
          <NavDropdown.Item onClick={handleProfileClick} >Your Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
            </Navbar>
       </>):
       (<>
       </>)
       }
      
            </>):(<p>Error</p>)}
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))", height: "100%"  }} className="d-flex flex-column justify-content-center align-items-center text-center ">
<div style={{
  backgroundImage: "#00d5ff"
}}>
 <br></br>
 <br></br>
</div>
      <div  style={{
        background: '#fff',
         // Add padding as needed
         width: '90%',
         height: 'auto',
         // Add overflow property to make it scrollable if content exceeds the height
         borderRadius: '10px',
       
        
      }}>
   
    {userData ? (
      <>
        {location.state && location.state.activeTab === 'patient' ? (
          // Content for patient
          <>
           {userData && (
  <>
  
  <p style={{
    position: 'relative',
   top: '10px',
    left: '10px',
    fontFamily: 'Arial',
    fontSize: '20px',
    textAlign: 'left',
  }}
>
   Hi {userData.firstName},
</p></>
)}

    {userData && (
              <>
               <br></br>
                <h2>Stent Record</h2>
                
                <br></br>
                {userData.stentData.map((stent, index) => (
                  <div key={index}>
   
      
          
   <Container> <p
  style={{
    position: 'relative',
    backgroundImage: `linear-gradient(${calculateColor(countdown(calculateDueDate(stent.insertedDate, stent.dueDate)).days)},${calculateColor(countdown(calculateDueDate(stent.insertedDate, stent.dueDate)).days)})`,
    width: '100%', // Adjust the width as needed
    height: '200px', // Adjust the height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Align content at the top
    alignItems: 'center', // Align items at the left
    padding: '10px', // Add padding to create space for the inner content
    textAlign: 'center',
    fontFamily: 'ds',
    fontSize: '50px',
    borderRadius: '10px',
    color : '#fff',
  }}
>

  <p
    style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      fontFamily: 'Arial',
      fontSize: '20px',
      textAlign: 'left',
    }}
  >
    Removal Date: {calculateDueDate(stent.insertedDate, stent.dueDate)}
  </p>
  <AnimatedCountdown
    insertedDate={formatDate(stent.insertedDate)}
    dueDate={calculateDueDate(stent.insertedDate, stent.dueDate)}
  />
 
  
</p>

</Container>


  <div className="row" style={{position: "center"}}>
  <div className="col-md-2" >
    <span className="inline-block">
      <div style={{ backgroundColor: 'green', width: '20px', height: '20px' }}></div>
    </span>
    <span className="inline-block block-label">Active</span>
  </div>

  <div className="col-md-2" >
    <span className="inline-block">
      <div style={{ backgroundColor: 'yellow', width: '20px', height: '20px' }}></div>
    </span>
    <span className="inline-block block-label">Due</span>
  </div>

  <div className="col-md-2" >
    <span className="inline-block">
      <div style={{ backgroundColor: 'red', width: '20px', height: '20px' }}></div>
    </span>
    <span className="inline-block block-label">Expired</span>
  </div>
</div>
     <br></br> 
     <Container>
     <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>No</th>
          <th>Laterality</th>
          <th>Insertion Date</th>
          <th>Expected Removal Date</th>
          <th>Insertion Place</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{stent.caseId}</td>
          <td>{stent.laterality}</td>
          <td>{formatDate(stent.insertedDate)}</td>
          <td>{calculateDueDate(stent.insertedDate, stent.dueDate)}</td>
          <td>{stent.placeOfInsertion}</td>
        </tr>
       
      </tbody>
    </Table>    
    </Container> 
                    {/* Add more stent data fields as needed */}
                  </div>
                ))}
              </>
            )}
          

           

          
          </>
        ) : location.state && location.state.activeTab === 'staff' ? (
          // Content for staff
          <>
         
          {userData.position === 'admin' && (
            // Content for admin
            <>
              <>
         <p style={{
    position: 'relative',
   top: '10px',
    left: '10px',
    fontFamily: 'Arial',
    fontSize: '20px',
    textAlign: 'left',
  }}
>
  Welcome {userData.firstName}{userData.surname} To NUST,
</p>
<p style={{
    position: 'relative',
   top: '10px',
    left: '10px',
    fontFamily: 'Arial',
    fontSize: '20px',
    textAlign: 'left',
  }}
>You are under Hospital {userData.hospitalName}</p>
 <Button variant='primary' onClick={handleShowPatientList}>Show Patient List</Button>   
 <Button variant='primary' onClick={handleShowUserList}>Show User List</Button>     
 <Button variant='primary' onClick={handleShowApplicationList}>Show Application List</Button> 
<Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} />
<Image
      src={`/images/${userData.image}`}
      alt='Profile Image'
      width={80}
      height={100}
      
    />
    
    
            {/* Display staff-related information */}
            {/* Example fields: email, firstName, surname, position, etc. */}
            <p>Email: {userData.email}</p>
            <p>First Name: {userData.firstName}</p>
            <p>Surname: {userData.surname}</p>
            <p>Position: {userData.position}</p>
            {/* Add more staff-related fields as needed */}
            {roleData && (
                <>
                  <h2>Role Information</h2>
                  <p>Role Name: {roleData.name}</p>
                  <p>Permissions: {roleData.permissions.join(', ')}</p>
                </>
              )}
           
          </>
              <Button variant='primary' onClick={handleShowUserList}>Show User List</Button>
              <Button variant='primary' onClick={handleShowApplicationList}>Show Application List</Button>
              {/* Other admin-specific content */}
            </>
          )}
    
          {userData.position === 'superAdmin' && (
            // Content for superAdmin
            <>
              <Button variant='primary' onClick={handleShowPatientList}>Show Patient List</Button>
              <Button variant='primary' onClick={handleShowUserList}>Show User List</Button>
              {/* Other superAdmin-specific content */}
            </>
          )}
    
          {userData.position === 'doctor' && (
            // Content for doctor
            <>
              <Button variant='primary' onClick={handleShowPatientList}>Show Patient List</Button>
              {/* Other doctor-specific content */}
            </>
          )}
        </>
        
        ) : (
          // Handle other cases or show an error message
          <p>Error: Invalid user type</p>
        )}
      </>

    )
     : (
      <p>Loading user data...</p>
    )}





  </div>
  <div style={{
  backgroundImage: "#0095ff"
}}>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
</div>
  </div>
  </div>
  );
};

export default MainPage;
