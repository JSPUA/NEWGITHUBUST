import React, { useState, useEffect } from 'react';
import { Form, Row, Col,Table,Navbar, Nav, NavDropdown,Image } from 'react-bootstrap';
import { VictoryPie, VictoryLabel,VictoryTooltip } from 'victory';
import Navbars from './Navbar';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const DailyCount = () => {
    const [startDate, setStartDate] = useState();
    const location =useLocation();
    const navigate = useNavigate();
    const { icNo, activeTab } = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState(null);
    const [counts, setCounts] = useState({ newStentCount: 0, replacedStentCount: 0, removedStentCount: 0,expireStent:0 });
    const hospitalName = "UPM";
    const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('All Hospitals');
  const [dependencies, setDependencies]=useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patientRoleData, setPatientRoleData] = useState(null);

    const isPermissionInRole = (permission) => {
        return roleData ? roleData.permissions.includes(permission) : (patientRoleData && patientRoleData.permissions.includes(permission));
      };

      const handleProfileClick = () => {
        // Assuming you want to navigate to the '/profile' route
        if(activeTab === 'staff'){
          navigate('/profileInfo', { state: { icNo: userData.icNo, role: roleData.name,activeTab: activeTab  } });
        }
        else if(activeTab === 'patient'){
          navigate('/profileInfo', { state: { icNo: userData.icNo, role: "patient" ,activeTab: activeTab} });
        }
       
      }; 

      const handleLogout = async () => {
        try {
          const response = await axios.post('http://localhost:5555/logout');
          if (response.data.success) {
            console.log("Logout");
            // Redirect to the login page or perform any other necessary actions
            navigate('/login');
          } else {
            console.error('Logout failed:', response.data.message);
          }
        } catch (error) {
          console.error('Error during logout:', error);
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
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch data here
            } catch (e) {
                setError('Failed to fetch data');
            }
            setIsLoading(false);
        };
    
        fetchData();
    }, [dependencies]);
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;



    // useEffect(() => {
    //     const fetchCounts = async () => {
    //         if (!startDate) return; // Don't fetch if startDate is not set
    //         try {
    //             const hospitalQueryParam = selectedHospital !== 'All Hospitals' ? `hospitalName=${selectedHospital}` : '';
    //             const response = await fetch(`http://localhost:5555/daily-count?hospitalName=${hospitalQueryParam}&startDate=${startDate}`);
    //             const data = await response.json();
    //             setCounts(data);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchCounts();
    // }, [startDate]); // This effect runs when startDate changes


    // useEffect(() => {
    //     const fetchCounts = async () => {
    //         if (!startDate) return; // Don't fetch if startDate is not set
    //         try {
    //             const hospitalQueryParam = selectedHospital !== 'All Hospitals' ? `hospitalName=${selectedHospital}` : '';
    //             const response = await fetch(`http://localhost:5555/daily-count?${hospitalQueryParam}&startDate=${startDate}`);
    //             const data = await response.json();
    //             setCounts(data);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    
    //     fetchCounts();
    // }, [selectedHospital, startDate]); 

    //the latest
    // useEffect(() => {
    //     const fetchCounts = async () => {
    //         if (!startDate) return; // Don't fetch if startDate is not set
    
    //         try {
    //             let url = `http://localhost:5555/`;
    //             url += selectedHospital === 'All Hospitals' ? 'all-daily-count' : 'daily-count';
    //             url += `?startDate=${startDate}`;
    
    //             if (selectedHospital !== 'All Hospitals') {
    //                 url += `&hospitalName=${selectedHospital}`;
    //             }
    
    //             const response = await fetch(url);
    //             const data = await response.json();
    //             setCounts({
    //                 newStentCount: data.newStentCount,
    //                 replacedStentCount: data.replacedStentCount,
    //                 removedStentCount: data.removedStentCount,
    //                 expireStent: data.expireStent
    //             });
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    
    //     fetchCounts();
    // }, [selectedHospital, startDate]); // Dependencies array includes selectedHospital and startDate
    
    useEffect(() => {
        const fetchCounts = async () => {
            if (!startDate) return; // Don't fetch if startDate is not set
    
            try {
                let url = `http://localhost:5555/`;
    
                // Determine the hospital name to use based on the user's position
                let hospitalNameToUse = selectedHospital;
                if (userData && userData.position === 'admin') {
                    hospitalNameToUse = userData.hospitalName;
                }
    
                url += hospitalNameToUse === 'All Hospitals' ? 'all-daily-count' : 'daily-count';
                url += `?startDate=${startDate}`;
    
                if (hospitalNameToUse !== 'All Hospitals') {
                    url += `&hospitalName=${hospitalNameToUse}`;
                }
    
                const response = await fetch(url);
                const data = await response.json();
                setCounts({
                    newStentCount: data.newStentCount,
                    replacedStentCount: data.replacedStentCount,
                    removedStentCount: data.removedStentCount,
                    expireStent: data.expireStent
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchCounts();
    }, [userData, selectedHospital, startDate]);

    // useEffect(() => {
    //     const fetchStentLogs = async () => {
    //         try {
    //             const hospitalQueryParam = selectedHospital !== 'All Hospitals' ? `hospitalName=${selectedHospital}` : '';
    //             const response = await fetch(`http://localhost:5555/stent-logs?hospitalName=${hospitalQueryParam}&startDate=${startDate}`);
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setLogs(data);
    //         } catch (error) {
    //             console.error('There was a problem with the fetch operation:', error);
    //         }
    //     };

    //     fetchStentLogs();
    // }, [selectedHospital, startDate]);

    // useEffect(() => {
    //     const fetchStentLogs = async () => {
    //         try {
    //             const hospitalQueryParam = selectedHospital !== 'All Hospitals' ? `hospitalName=${selectedHospital}` : '';
    //             const response = await fetch(`http://localhost:5555/stent-logs?${hospitalQueryParam}&startDate=${startDate}`);
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setLogs(data);
    //         } catch (error) {
    //             console.error('There was a problem with the fetch operation:', error);
    //         }
    //     };
    
    //     fetchStentLogs();
    // }, [selectedHospital, startDate]);

    useEffect(() => {
        const fetchStentLogs = async () => {
            if (!startDate) return; // Don't fetch if startDate is not set
    
            try {
                let url = `http://localhost:5555/`;
                url += selectedHospital === 'All Hospitals' ? 'all-stent-logs' : 'stent-logs';
                url += `?startDate=${startDate}`;
    
                if (selectedHospital !== 'All Hospitals') {
                    url += `&hospitalName=${selectedHospital}`;
                }
    
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
    
        fetchStentLogs();
    }, [selectedHospital, startDate]); // Dependencies array includes selectedHospital and startDate
    

    const handleHospitalSelect = async (hospital) => {
   
        setSelectedHospital(hospital);
    
       
      };

      useEffect(() => {
        // Fetch additional user data based on the stored token or user information
        const fetchUserData = async () => {
          try {
            console.log(icNo);
            console.log(activeTab);
            
            // You should ideally send the authentication token with the request
            // For simplicity, assuming the server knows the user based on the token
            let endpoint = '';
            if (activeTab === 'staff') {
              endpoint = `http://localhost:5555/getStaffByEmail/${icNo}`;
            } else if (activeTab === 'patient') {
              endpoint = `http://localhost:5555/getPatientByEmail/${icNo}`;
            } else {
              // Handle other cases or show an error
              console.error('Invalid user type:', activeTab);
              // Redirect to login or handle the error as needed
              navigate('/login');
              return;
            }
      
            const response = await axios.get(endpoint, {
              // headers: { Authorization: `Bearer ${yourAuthToken}` },
            });
      
    
            if (activeTab === 'staff') {
              setUserData(response.data.staff); // Change from 'user' to 'patient' based on your server response
              const roleResponse = await axios.get(`http://localhost:5555/role/${response.data.staff.position}`);
              setRoleData(roleResponse.data);
           
    
              
            }
            else if(activeTab === 'patient'){
              setUserData(response.data.patient);
              const patientRoleResponse = await axios.get(`http://localhost:5555/role/patient`);
              setPatientRoleData(patientRoleResponse.data);
              
            }
            
            else {
              // Handle other cases or show an error
              console.error('Invalid user type:', activeTab);
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
       

    const pieChartData = [
        { x: "New Stents", y: counts.newStentCount },
        { x: "Replaced Stents", y: counts.replacedStentCount },
        { x: "Removed Stents", y: counts.removedStentCount },
        { x: "Expired Stents", y: counts.expireStent }
    ];


    return (
        <div>
            {/* <Navbars selectedHospital={selectedHospital} setSelectedHospital={setSelectedHospital} /> */}
<div>
{userData ? (
        <>
       { (activeTab==="patient")||userData.position==="admin"||userData.position==="doctor" ?(
       <>
        <Navbar bg="light"  expand="lg" >
       <Navbar.Brand>
  <Link to="/mainPage">
    <Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} />
  </Link>
</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                   
   
                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
      {isPermissionInRole('addPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/addPatient",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Patients
    </Link>
  </NavDropdown.Item>
)}
       {isPermissionInRole('viewPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/showPatient",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Patients
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('editPatient') && <NavDropdown.Item href="#">Edit Patients</NavDropdown.Item>}
        {isPermissionInRole('deletePatient') && <NavDropdown.Item href="#">Delete Patients</NavDropdown.Item>}
      </NavDropdown>
                         )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/researchList",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Research
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/uploadPDF",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      {/* {(isPermissionInRole('addStent')  ) && ( 
      <NavDropdown title="Stents" id="nav-stents-dropdown">
          {isPermissionInRole('addStent') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('addStent') && <NavDropdown.Item href="#">Add Stent</NavDropdown.Item>}
        {isPermissionInRole('myStentRecord') && <NavDropdown.Item href="#">My Stent Record</NavDropdown.Item>}
      </NavDropdown>
      )} */}
      
      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}
                        {/* Add other navigation links based on permissions */}
                      
          {(isPermissionInRole('setRole') ) && (                  
      <NavDropdown title="Role And Permission" id="nav-patients-dropdown">
      {isPermissionInRole('setRole') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/rolePermission",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Role and Permission Setting
    </Link>
  </NavDropdown.Item>
)}
      
      </NavDropdown>
                         )}
 {(isPermissionInRole('viewDailyReport') || isPermissionInRole('viewSpecificTimeReport')|| isPermissionInRole('viewFurtherReport') ) && ( 
      <NavDropdown title="Reports" id="nav-research-dropdown">
        {isPermissionInRole('viewDailyReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/dailyCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Daily Report
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/specificDateCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position,hospitalName: userData.hospitalName}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Specific Time Range Report
    </Link>
  </NavDropdown.Item>
)}
  {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/chart",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
    Insertion and Forgotten Report
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}


               
                    </Nav>
                    
                </Navbar.Collapse>
                
       <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
      <Nav>
        <NavDropdown
          title={
            <img
            src={`/images/${(activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
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
       <Navbar.Brand>
  <Link to="/mainPage">
    <Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} />
  </Link>
</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                   
    <Navbar>
    <Link to={{
      pathname: "/pd",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      ParentDaily
      </Link>
    
    </Navbar>
                         {/* Patients Dropdown */}
                         {(isPermissionInRole('addPatient') || isPermissionInRole('viewPatient') || isPermissionInRole('editPatient') || isPermissionInRole('deletePatient')) && (                  
      <NavDropdown title="Patients" id="nav-patients-dropdown">
      {isPermissionInRole('addPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/addPatient",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Patients
    </Link>
  </NavDropdown.Item>
)}
       {isPermissionInRole('viewPatient') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/showPatient",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Patients
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('editPatient') && <NavDropdown.Item href="#">Edit Patients</NavDropdown.Item>}
        {isPermissionInRole('deletePatient') && <NavDropdown.Item href="#">Delete Patients</NavDropdown.Item>}
      </NavDropdown>
                         )}

      {/* Research Dropdown */}
 {(isPermissionInRole('viewResearch') || isPermissionInRole('addResearch') ) && ( 
      <NavDropdown title="Research" id="nav-research-dropdown">
        {isPermissionInRole('viewResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/researchList",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Research
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('addResearch') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/uploadPDF",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

      {/* Stents Dropdown */}
      {/* {(isPermissionInRole('addStent')  ) && ( 
      <NavDropdown title="Stents" id="nav-stents-dropdown">
          {isPermissionInRole('addStent') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Add Research
    </Link>
  </NavDropdown.Item>
)}
        {isPermissionInRole('addStent') && <NavDropdown.Item href="#">Add Stent</NavDropdown.Item>}
        {isPermissionInRole('myStentRecord') && <NavDropdown.Item href="#">My Stent Record</NavDropdown.Item>}
      </NavDropdown>
      )} */}
      
      {/* Additional Links */}
      {isPermissionInRole('contactDR') && <Nav.Link href="#">Contact DR</Nav.Link>}
      {/* Add other navigation links as needed */}
                        {/* Add other navigation links based on permissions */}
                      
          {(isPermissionInRole('setRole') ) && (                  
      <NavDropdown title="Role And Permission" id="nav-patients-dropdown">
      {isPermissionInRole('setRole') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/rolePermission",
      state: {icNo: icNo, activeTab: "staff", position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Role and Permission Setting
    </Link>
  </NavDropdown.Item>
)}
      
      </NavDropdown>
                         )}
 {(isPermissionInRole('viewDailyReport') || isPermissionInRole('viewSpecificTimeReport')|| isPermissionInRole('viewFurtherReport') ) && ( 
      <NavDropdown title="Reports" id="nav-research-dropdown">
        {isPermissionInRole('viewDailyReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/dailyCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      View Daily Report
    </Link>
  </NavDropdown.Item>
)}
    {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/specificDateCount",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position,hospitalName: userData.hospitalName}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
      Specific Time Range Report
    </Link>
  </NavDropdown.Item>
)}
  {isPermissionInRole('viewSpecificTimeReport') && (
  <NavDropdown.Item as="div">
    <Link to={{
      pathname: "/chart",
      state: {icNo: icNo, activeTab: activeTab, position: userData.position}
    }} style={{ textDecoration: 'none', color: 'inherit' }}>
    Insertion and Forgotten Report
    </Link>
  </NavDropdown.Item>
)}
      </NavDropdown>
 )}

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
            src={`/images/${(activeTab === 'staff' ? userData.image : userData.profilePic) || 'DefaultProfilePic.jpg'}`}
            
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

            {userData && userData.hospitalName ? userData.hospitalName : ""}

</div>
            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ maxWidth: '800px',maxHeight: '500px',background: "grey" , borderRadius: "20px" }}> 
            <Row className="mt-4">
                <VictoryPie
                // animate={{
                //     duration: 1000, 
                //     easing: "quad" 
                //   }}
                padAngle={({ datum }) => 6}
                    data={pieChartData}
                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
                    colorScale={["#E0FFFF", "#D2B48C","#F0E68C","#FFB6C1"]}
                    innerRadius={50}
                    labelRadius={100}
                    labelComponent={<VictoryTooltip 
                        style={{ fontSize: 30 }} // Set the font size for the tooltip text here
                        flyoutStyle={{ stroke: "none", fill: "white" }} />}
                        style={{
                            data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                            labels: { fontSize: 14, fill: "black" },
                            parent: { maxWidth: '100%' }
                          }}
                />
            </Row>
            </div>
            </div>
            <Row className="mt-4">
                <Col>
                <div className="count-block" style={{ color: "black" , backgroundColor: "#E0FFFF", width:"100px",height:"100px",fontFamily: 'ds', fontSize: '100px'}}>{counts.newStentCount}</div>
                </Col>
                <Col>
                    <div className="count-block" style={{ color: "black" , backgroundColor: "#D2B48C", width:"100px",height:"100px",fontFamily: 'ds', fontSize: '100px'}}>{counts.replacedStentCount}</div>
                </Col>
                <Col>
                    <div className="count-block" style={{ color: "black" , backgroundColor: "#F0E68C", width:"100px",height:"100px",fontFamily: 'ds', fontSize: '100px'}}>{counts.removedStentCount}</div>
                </Col>
                <Col>
                    <div className="count-block" style={{ color: "black" , backgroundColor: "#FFB6C1", width:"100px",height:"100px",fontFamily: 'ds', fontSize: '100px'}}>{counts.expireStent}</div>
                </Col>
            </Row>
            <div>
            <h2>Stent Logs</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                    <th>No</th>
                        <th>Patient IC</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Timestamp</th>
                        <th>Hospital Name</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{log.patientIcNo}</td>
                            <td>{log.action}</td>
                            <td>{JSON.stringify(log.details)}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.hospitalName}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </div>
        
    );
};

export default DailyCount;


