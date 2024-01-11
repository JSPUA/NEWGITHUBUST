import React, { useState } from 'react';
import axios from 'axios';
import {useLocation,Link,useNavigate,useParams } from 'react-router-dom';
import { Navbar, Nav, NavDropdown,Form,Image ,Button,Table,Container,Col,Row,Modal,InputGroup} from 'react-bootstrap';
import { MdOutlineDelete, MdOutlineEdit, MdOutlineInfo, MdOutlineSearch, MdOutlineEmail } from 'react-icons/md';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';

const AddStentRecord = () => {

  const [userData, setUserData] = useState(null);
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
  const [roleData, setRoleData] = useState(null);
  const [patientRoleData, setPatientRoleData] = useState(null);
 

  const location = useLocation();
  const icNo = location.state.icNo;
  const activeTab=location.state.activeTab;
  // const icNo= location.state.icNo;
  
  const [formData, setFormData] = useState({
    mrnNo: '',
    stentData: [
      {
        
        laterality: '',
        hospitalName: '',
        insertedDate: '',
        dueDate: '',
        size: '',
        length: '',
        stentType: '',
        stentBrand: '',
        placeOfInsertion: '',
        remarks: '',
      },
    ],
  });

  const [usedMrnNumbers, setUsedMrnNumbers] = useState([]);

  const handleInputChange = (e, stentIndex, fieldName) => {
    const updatedStentData = [...formData.stentData];
    updatedStentData[stentIndex][fieldName] = e.target.value;

    setFormData({
      ...formData,
      stentData: updatedStentData,
    });
  };

  const addStentRow = () => {
    if (formData.stentData.length < 2) {
    setFormData({
      ...formData,
      stentData: [
        ...formData.stentData,
        {
          
          laterality: '',
          hospitalName: '',
          insertedDate: '',
          dueDate: '',
          size: '',
          length: '',
          stentType: '',
          stentBrand: '',
          placeOfInsertion: '',
          remarks: '',
        },
      ],
    });
}
  };

  const removeStentRow = (stentIndex) => {
    if (formData.stentData.length > 1) {
    const updatedStentData = formData.stentData.filter((_, i) => i !== stentIndex);
    setFormData({
      ...formData,
      stentData: updatedStentData,
    });
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       
        if (usedMrnNumbers.includes(formData.mrnNo)) {
            console.error('MRN No already used.');
            return;
          }
    
        
      const response = await axios.post('http://localhost:5555/stentRecords', formData);
      console.log('Stent record added:', response.data);

      setUsedMrnNumbers([...usedMrnNumbers, formData.mrnNo]);
      // You can add further actions after a successful submission, e.g., redirect to a different page.
    } catch (err) {
      console.error('Error adding stent record:', err);
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
          console.log(userData);
          const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
          setRoleData(roleResponse.data);
          console.log(roleResponse);
       

          
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
  }, [navigate, icNo]); 


  return (
    
    <div>
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

            </div>



      <h2>Add Stent Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>MRN No:</label>
          <input
            type="text"
            name="mrnNo"
            value={formData.mrnNo}
            onChange={(e) => setFormData({ ...formData, mrnNo: e.target.value })}
            required
          />
        </div>
        {formData.stentData.map((stent, stentIndex) => (
          <div key={stentIndex}>
            <h3>Stent #{stentIndex + 1}</h3>
            
            {/* Add more input fields for stent data */}
            <div className="form-group">
              <label>Laterality:</label>
              <input
                type="text"
                name="laterality"
                value={stent.laterality}
                onChange={(e) => handleInputChange(e, stentIndex, 'laterality')}
              />
            </div>
            <div className="form-group">
              <label>Inserted in Hospital:</label>
              <input
                type="text"
                name="hospitalName"
                value={stent.hospitalName}
                onChange={(e) => handleInputChange(e, stentIndex, 'hospitalName')}
              />
            </div>
            <div className="form-group">
              <label>Inserted Date:</label>
              <input
                type="date"
                name="insertedDate"
                value={stent.insertedDate}
                onChange={(e) => handleInputChange(e, stentIndex, 'insertedDate')}
              />
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={stent.dueDate}
                onChange={(e) => handleInputChange(e, stentIndex, 'dueDate')}
              />
            </div>
            <div className="form-group">
              <label>Size:</label>
              <input
                type="text"
                name="size"
                value={stent.size}
                onChange={(e) => handleInputChange(e, stentIndex, 'size')}
              />
            </div>
            <div className="form-group">
              <label>Length:</label>
              <input
                type="text"
                name="length"
                value={stent.length}
                onChange={(e) => handleInputChange(e, stentIndex, 'length')}
              />
            </div>
            <div className="form-group">
              <label>Stent Type:</label>
              <input
                type="text"
                name="stentType"
                value={stent.stentType}
                onChange={(e) => handleInputChange(e, stentIndex, 'stentType')}
              />
            </div>
            <div className="form-group">
              <label>Stent Brand:</label>
              <input
                type="text"
                name="stentBrand"
                value={stent.stentBrand}
                onChange={(e) => handleInputChange(e, stentIndex, 'stentBrand')}
              />
            </div>
            <div className="form-group">
              <label>Place of Insertion:</label>
              <input
                type="text"
                name="placeOfInsertion"
                value={stent.placeOfInsertion}
                onChange={(e) => handleInputChange(e, stentIndex, 'placeOfInsertion')}
              />
            </div>
            <div className="form-group">
              <label>Remarks:</label>
              <input
                type="text"
                name="remarks"
                value={stent.remarks}
                onChange={(e) => handleInputChange(e, stentIndex, 'remarks')}
              />
            </div>
            {/* Add other stent data input fields similarly */}
            {formData.stentData.length < 2 && (
            <button type="button" onClick={addStentRow}>
              Add Another Stent
            </button>
              )}
            {formData.stentData.length > 1 && (
              <button type="button" onClick={() => removeStentRow(stentIndex)}>
                Remove This Stent
              </button>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddStentRecord;
