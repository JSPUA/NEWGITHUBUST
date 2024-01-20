import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Image,
  Button,
  Table,
  Container,
  Col,
  Row,
  Modal,
  InputGroup,
  Tabs,
  Tab,
  Card,
} from "react-bootstrap";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import axios from "axios";
import AnimatedCountdown from "./AnimatedCountdown";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineInfo,
  MdOutlineSearch,
  MdOutlineEmail,
} from "react-icons/md";
import { BsInfoCircle, BsSearch } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";

function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function countdown(dueDate) {
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
  const { email } = useParams();
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
  let profileImageSrc = "/images/DefaultProfilePic.jpg";
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [removeRecords, setRemoveRecords] = useState([]);
  const [replaceRecords, setReplaceRecords] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [allPatientData, setAllPatientData] = useState([]);
  const [expiredPatientData, setExpiredPatientData] = useState([]);
  const [duePatientData, setDuePatientData] = useState([]);
  const [activePatientData, setActivePatientData] = useState([]);
  const [activeDoctorTab, setActiveDoctorTab] = useState("myPatient");
  const { icNo, activeTab } = useSelector((state) => state.user);

  // const{activeTab}=useParams();
  const isPermissionInRole = (permission) => {
    return roleData
      ? roleData.permissions.includes(permission)
      : patientRoleData && patientRoleData.permissions.includes(permission);
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5555/logout");
      if (response.data.success) {
        // Redirect to the login page or perform any other necessary actions
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const calculateColor = (dayLeft) => {
    if (dayLeft > 14) {
      return "green";
    } else if (dayLeft > 0) {
      return "yellow";
    } else {
      return "red";
    }
  };

  const handleShowPatientList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate("/patient-list", {
        state: { hospitalName: userData.hospitalName },
      });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error("Error: userData or hospitalName not available");
    }
  };

  const handleShowUserList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate("/user-list", {
        state: { hospitalName: userData.hospitalName },
      });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error("Error: userData or hospitalName not available");
    }
  };

  const handleResearch = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate("/chatbot", { state: { hospitalName: userData.hospitalName } });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error("Error: userData or hospitalName not available");
    }
  };

  const handleShowApplicationList = () => {
    // Check if the user data and hospitalName are available
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate("/application-list", {
        state: { hospitalName: userData.hospitalName },
      });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error("Error: userData or hospitalName not available");
    }
  };

  const handleProfileClick = () => {
    // Assuming you want to navigate to the '/profile' route
    if (activeTab === "staff") {
      navigate("/profileInfo", {
        state: {
          icNo: userData.icNo,
          role: roleData.name,
          activeTab: activeTab,
        },
      });
    } else if (activeTab === "patient") {
      navigate("/profileInfo", {
        state: { icNo: userData.icNo, role: "patient", activeTab: activeTab },
      });
    }
  };

  // const handleHospitalSelect = async (hospital) => {
  //   setSelectedHospital(hospital);
  //   try {
  //     const response = await axios.get(`http://localhost:5555/getPatients`); // Fetch all patients
  //     const patients = response.data.patients;
  //     if (hospital === 'All Hospitals') {
  //       setFilteredPatients(patients); // Set all patients if 'All Hospitals' is selected
  //     } else {
  //       const filtered = patients.filter(patient => patient.hospitalName === hospital);
  //       setFilteredPatients(filtered); // Filter and set patients for the selected hospital
  //     }
  //   } catch (error) {
  //     console.error('Error fetching patients:', error);
  //   }
  // };
  const handleHospitalSelect = async (hospital) => {
    setSelectedHospital(hospital);
  };

  useEffect(() => {
    const fetchHospitalNames = async () => {
      try {
        const response = await fetch("http://localhost:5555/hospitalsP");
        const data = await response.json();
        setHospitalNames(data.hospitals);
      } catch (error) {
        console.error("Error fetching hospital names:", error);
      }
    };

    fetchHospitalNames();
  }, []);

  const handleTabChange = (tabKey) => {
    setActiveDoctorTab(tabKey);
  };

  useEffect(() => {
    //fetch patient according to selection for doctor page
    const apiUrl =
      activeDoctorTab === "myPatient"
        ? `http://localhost:5555/api/patient/${icNo}`
        : `http://localhost:5555/api/patient/hospital/${userData.hospitalName}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setAllPatientData(data);
        setPatientData(data);
        console.log("data", patientData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    getExpiredPatient(activeDoctorTab);
    getDuePatient(activeDoctorTab);
    getActivePatient(activeDoctorTab);
  }, [activeDoctorTab]);

  //get all patient for doctor
  const allPatient = () => {
    const apiUrl =
      activeDoctorTab === "myPatient"
        ? `http://localhost:5555/api/patient/${icNo}`
        : `http://localhost:5555/api/patient/hospital/${userData.hospitalName}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data); // Update the state with the received data
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  //get expired patient for doctor
  const getExpiredPatient = (activeDoctorTab) => {
    const apiUrl =
      activeDoctorTab === "myPatient"
        ? `http://localhost:5555/api/patient/expired/${icNo}`
        : `http://localhost:5555/api/patient/expired/hospital/${userData.hospitalName}`;

    // Make the API request
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setExpiredPatientData(data); // Update the state with the received data
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const expiredPatient = () => {
    setPatientData(expiredPatientData);
  };

  //get due patient for doctor
  const getDuePatient = (activeDoctorTab) => {
    const apiUrl =
      activeDoctorTab === "myPatient"
        ? `http://localhost:5555/api/patient/due/${icNo}`
        : `http://localhost:5555/api/patient/due/hospital/${userData.hospitalName}`;

    // Make the API request
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setDuePatientData(data); // Update the state with the received data
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const duePatient = () => {
    setPatientData(duePatientData);
  };

  const getActivePatient = (activeDoctorTab) => {
    const apiUrl =
      activeDoctorTab === "myPatient"
        ? `http://localhost:5555/api/patient/active/${icNo}`
        : `http://localhost:5555/api/patient/active/hospital/${userData.hospitalName}`;

    console.log("click");

    // Make the API request
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setActivePatientData(data); // Update the state with the received data
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  //get active patient for doctor
  const activePatient = () => {
    setPatientData(activePatientData);
  };

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        let response;
        if (selectedHospital === "All Hospitals") {
          response = await axios.get("http://localhost:5555/getPatients");

          // Adjust the endpoint as necessary
        } else {
          response = await axios.get(
            `http://localhost:5555/hospitalsP/${selectedHospital}/patients`
          );
        }

        if (response && response.data && response.data.patients) {
          const filtered = filterPatients(
            response.data.patients,
            searchTerm,
            selectedHospital
          );
          setFilteredPatients(filtered);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchAllPatients();
  }, [searchTerm, selectedHospital]);

  const navigateToResearchList = () => {
    if (userData && userData.hospitalName) {
      // Navigate to the patient page and pass the hospitalName in the state
      navigate("/researchList", {
        state: { hospitalName: userData.hospitalName },
      });
    } else {
      // Handle the case where userData or hospitalName is not available
      console.error("Error: userData or hospitalName not available");
    }
  };

  useEffect(() => {
    // Fetch additional user data based on the stored token or user information
    const fetchUserData = async () => {
      try {
        console.log(icNo);
        console.log(activeTab);

        // You should ideally send the authentication token with the request
        // For simplicity, assuming the server knows the user based on the token
        let endpoint = "";
        if (activeTab === "staff") {
          endpoint = `http://localhost:5555/getStaffByEmail/${icNo}`;
        } else if (activeTab === "patient") {
          endpoint = `http://localhost:5555/getPatientByEmail/${icNo}`;
        } else {
          // Handle other cases or show an error
          console.error("Invalid user type:", activeTab);
          // Redirect to login or handle the error as needed
          navigate("/login");
          return;
        }

        const response = await axios.get(endpoint, {
          // headers: { Authorization: `Bearer ${yourAuthToken}` },
        });

        if (activeTab === "staff") {
          setUserData(response.data.staff); // Change from 'user' to 'patient' based on your server response
          const roleResponse = await axios.get(
            `http://localhost:5555/role/${response.data.staff.position}`
          );
          setRoleData(roleResponse.data);
        } else if (activeTab === "patient") {
          setUserData(response.data.patient);
          const patientRoleResponse = await axios.get(
            `http://localhost:5555/role/patient`
          );
          setPatientRoleData(patientRoleResponse.data);
        } else {
          // Handle other cases or show an error
          console.error("Invalid user type:", activeTab);
          // Redirect to login or handle the error as needed
          navigate("/login");
          return;
        }
        // Default image
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., redirect to login)
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, icNo]);

  // Combine both dependencies in a single array

  useEffect(() => {
    if (userData && userData.mrnNo)
      axios
        .get(`http://localhost:5555/stentRecords/${userData.mrnNo}`) // Adjust the URL to your API endpoint
        .then((response) => {
          setRecords(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the stent records!",
            error
          );
        });
  }, [userData]);

  useEffect(() => {
    if (userData && userData.mrnNo)
      axios
        .get(`http://localhost:5555/removedStents/${userData.mrnNo}`) // Adjust the URL to your API endpoint
        .then((response) => {
          setRemoveRecords(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the stent records!",
            error
          );
        });
  }, [userData]);

  useEffect(() => {
    if (userData && userData.mrnNo)
      axios
        .get(`http://localhost:5555/replaceStents/${userData.mrnNo}`) // Adjust the URL to your API endpoint
        .then((response) => {
          setReplaceRecords(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the stent records!",
            error
          );
        });
  }, [userData]);

  const calculateDueDate = (insertedDate, dueIn) => {
    if (!insertedDate) {
      return "";
    }

    // Convert the dueIn value to the number of days
    let days = 0;
    switch (dueIn) {
      case "2 weeks":
        days = 14;
        break;
      case "1 month":
        days = 30;
        break;
      case "2 months":
        days = 60;
        break;
      case "3 months":
        days = 90;
        break;
      case "6 months":
        days = 180;
        break;
      case "12 months":
        days = 365; // Approximated to 365 days for a year
        break;
      case "permanent":
        days = 0;
        break;
      default:
        days = 0;
    }

    // Calculate the due date by adding the number of days to the inserted date
    const insertedDateTime = new Date(insertedDate).getTime();
    const dueDateTime = new Date(insertedDateTime + days * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDateTime.toISOString().split("T")[0];

    return formattedDueDate;
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Implement your delete logic here
    axios
      .delete(`http://localhost:5555/deletePatient/${patientToDelete._id}`)
      .then(() => {
        setShowSuccessModal(true);
        setPatients((prevPatients) =>
          prevPatients.filter((p) => p._id !== patientToDelete._id)
        );
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);
      });
  };

  const handleCancelDelete = () => {
    setPatientToDelete(null);
    setShowDeleteModal(false);
  };

  const filterPatients = (patients, searchTerm, selectedHospital) => {
    return patients.filter((patient) => {
      const matchesSearchTerm =
        patient.mrnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${patient.firstName} ${patient.surname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(patient.dob).includes(searchTerm) ||
        patient.icNo.toString().includes(searchTerm) ||
        patient.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mobileNo.toString().includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());

      // const matchesHospital = selectedHospital === 'All Hospitals' || patient.stentData[0].hospitalName === selectedHospital;

      let matchesHospital = selectedHospital === "All Hospitals";
      if (
        !matchesHospital &&
        patient.stentData &&
        patient.stentData.length > 0
      ) {
        matchesHospital = patient.stentData.some(
          (stent) => stent.hospitalName === selectedHospital
        );
      }

      console.log(matchesHospital);
      return matchesSearchTerm && matchesHospital;
    });
  };

  return (
    <div>
      {userData ? (
        <>
          {activeTab === "patient" ||
          userData.position === "admin" ||
          userData.position === "doctor" ? (
            <>
              <Navbar
                expand="lg"
                style={{
                  backgroundColor: "white",
                  padding: "0.5rem 20px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Navbar.Brand>
                  <Link to="/mainPage">
                    <Image
                      src="./MML.png"
                      alt="Logo"
                      fluid
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    {/* Patients Dropdown */}
                    {(isPermissionInRole("addPatient") ||
                      isPermissionInRole("viewPatient") ||
                      isPermissionInRole("editPatient") ||
                      isPermissionInRole("deletePatient")) && (
                      <NavDropdown title="Patients" id="nav-patients-dropdown">
                        {isPermissionInRole("addPatient") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/addPatient",
                                state: {
                                  icNo: icNo,
                                  activeTab: "staff",
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Add Patients
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewPatient") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/showPatient",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Patients
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("editPatient") && (
                          <NavDropdown.Item href="#">
                            Edit Patients
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("deletePatient") && (
                          <NavDropdown.Item href="#">
                            Delete Patients
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {/* Research Dropdown */}
                    {(isPermissionInRole("viewResearch") ||
                      isPermissionInRole("addResearch")) && (
                      <NavDropdown title="Research" id="nav-research-dropdown">
                        {isPermissionInRole("viewResearch") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/researchList",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Research
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("addResearch") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/uploadPDF",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Add Research
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {isPermissionInRole("chatBot") && (
                      <NavDropdown title="Chatbot" id="nav-research-dropdown">
                        {isPermissionInRole("chatBot") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/chatbot",
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Chatbot
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("addResearch") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/uploadPDF",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
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
                    {isPermissionInRole("contactDR") && (
                      <Nav.Link href="#">Contact DR</Nav.Link>
                    )}
                    {/* Add other navigation links as needed */}
                    {/* Add other navigation links based on permissions */}

                    {isPermissionInRole("setRole") && (
                      <NavDropdown
                        title="Role And Permission"
                        id="nav-patients-dropdown"
                      >
                        {isPermissionInRole("setRole") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/rolePermission",
                                state: {
                                  icNo: icNo,
                                  activeTab: "staff",
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Role and Permission Setting
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}
                    {(isPermissionInRole("viewDailyReport") ||
                      isPermissionInRole("viewSpecificTimeReport") ||
                      isPermissionInRole("viewFurtherReport")) && (
                      <NavDropdown title="Reports" id="nav-research-dropdown">
                        {isPermissionInRole("viewDailyReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/dailyCount",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Daily Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewSpecificTimeReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/specificDateCount",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                  hospitalName: userData.hospitalName,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Specific Time Range Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewFurtherReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/chart",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Insertion and Forgotten Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {/* <NavDropdown title={selectedHospital || 'Select Hospital'} id="basic-nav-dropdown">
                        <NavDropdown.Item key="all-hospitals" onClick={() => handleHospitalSelect('All Hospitals')}>
    All Hospitals
  </NavDropdown.Item>
  {hospitalNames.map((hospital, index) => (
    <NavDropdown.Item key={index} onClick={() => handleHospitalSelect(hospital)}>
      {hospital}
    </NavDropdown.Item>
  ))}
          </NavDropdown>                      */}
                  </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse
                  id="responsive-navbar-nav"
                  className="justify-content-end"
                >
                  <Nav>
                    <NavDropdown
                      title={
                        <img
                          src={`/images/${
                            (activeTab === "staff"
                              ? userData.image
                              : userData.profilePic) || "DefaultProfilePic.jpg"
                          }`}
                          alt="Profile Image"
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            border: "2px solid #fff",
                          }}
                        />
                      }
                      id="collasible-nav-dropdown"
                      className="custom-dropdown" // Add a custom class for styling
                    >
                      <NavDropdown.Item onClick={handleProfileClick}>
                        Your Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </>
          ) : userData.position === "superAdmin" ? (
            <>
              <Navbar
                style={{
                  backgroundColor: "white",
                  padding: "0.5rem 20px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                expand="lg"
              >
                <Navbar.Brand href="#">
                  <Image
                    src="./MML.png"
                    alt="Logo"
                    fluid
                    style={{ width: "100px", height: "auto" }}
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="/mainPage">Home</Nav.Link>
                    {/* Patients Dropdown */}
                    {(isPermissionInRole("addPatient") ||
                      isPermissionInRole("viewPatient") ||
                      isPermissionInRole("editPatient") ||
                      isPermissionInRole("deletePatient")) && (
                      <NavDropdown title="Patients" id="nav-patients-dropdown">
                        {isPermissionInRole("addPatient") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/addPatient",
                                state: {
                                  icNo: icNo,
                                  activeTab: "staff",
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Add Patients
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewPatient") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/showPatient",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Patients
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("editPatient") && (
                          <NavDropdown.Item href="#">
                            Edit Patients
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("deletePatient") && (
                          <NavDropdown.Item href="#">
                            Delete Patients
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {/* Research Dropdown */}
                    {(isPermissionInRole("viewResearch") ||
                      isPermissionInRole("addResearch")) && (
                      <NavDropdown title="Research" id="nav-research-dropdown">
                        {isPermissionInRole("viewResearch") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/researchList",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Research
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("addResearch") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/uploadPDF",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Add Research
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {/* Stents Dropdown */}
                    {(isPermissionInRole("viewResearch") ||
                      isPermissionInRole("addResearch")) && (
                      <NavDropdown title="Stents" id="nav-stents-dropdown">
                        {isPermissionInRole("addStent") && (
                          <NavDropdown.Item href="#">
                            Add Stent
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("myStentRecord") && (
                          <NavDropdown.Item href="#">
                            My Stent Record
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {/* Additional Links */}
                    {isPermissionInRole("contactDR") && (
                      <Nav.Link href="#">Contact DR</Nav.Link>
                    )}
                    {/* Add other navigation links as needed */}
                    {/* Add other navigation links based on permissions */}
                    <NavDropdown
                      title={selectedHospital || "Select Hospital"}
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item
                        key="all-hospitals"
                        onClick={() => handleHospitalSelect("All Hospitals")}
                      >
                        All Hospitals
                      </NavDropdown.Item>
                      {hospitalNames.map((hospital, index) => (
                        <NavDropdown.Item
                          key={index}
                          onClick={() => handleHospitalSelect(hospital)}
                        >
                          {hospital}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                    {isPermissionInRole("setRole") && (
                      <NavDropdown
                        title="Role And Permission"
                        id="nav-patients-dropdown"
                      >
                        {isPermissionInRole("setRole") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/rolePermission",
                                state: {
                                  icNo: icNo,
                                  activeTab: "staff",
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Role and Permission Setting
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {(isPermissionInRole("viewDailyReport") ||
                      isPermissionInRole("viewSpecificTimeReport") ||
                      isPermissionInRole("viewFurtherReport")) && (
                      <NavDropdown title="Reports" id="nav-research-dropdown">
                        {isPermissionInRole("viewDailyReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/dailyCount",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              View Daily Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewSpecificTimeReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/specificDateCount",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                  hospitalName: userData.hospitalName,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Specific Time Range Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                        {isPermissionInRole("viewSpecificTimeReport") && (
                          <NavDropdown.Item as="div">
                            <Link
                              to={{
                                pathname: "/chart",
                                state: {
                                  icNo: icNo,
                                  activeTab: activeTab,
                                  position: userData.position,
                                },
                              }}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              Insertion and Forgotten Report
                            </Link>
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}
                  </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse
                  id="responsive-navbar-nav"
                  className="justify-content-end"
                >
                  <Nav>
                    <NavDropdown
                      title={
                        <img
                          src={`/images/${
                            (activeTab === "staff"
                              ? userData.image
                              : userData.profilePic) || "DefaultProfilePic.jpg"
                          }`}
                          alt="Profile Image"
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            border: "2px solid #fff",
                          }}
                        />
                      }
                      id="collasible-nav-dropdown"
                      className="custom-dropdown" // Add a custom class for styling
                    >
                      <NavDropdown.Item onClick={handleProfileClick}>
                        Your Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <p>Error</p>
      )}
      <div
        style={{
          height: "100%",
        }}
        className="d-flex flex-column justify-content-center align-items-center text-center "
      >
        <div
          style={{
            backgroundImage: "#00d5ff",
          }}
        >
          <br></br>
          <br></br>
        </div>
        <div
          style={{
            background: "",
            // Add padding as needed
            width: "90%",
            height: "auto",
            // Add overflow property to make it scrollable if content exceeds the height
            borderRadius: "10px",
          }}
        >
          {userData ? (
            <>
              {activeTab === "patient" ? (
                // Content for patient
                <>
                  {userData && (
                    <>
                      <p
                        style={{
                          position: "relative",
                          top: "10px",
                          left: "10px",
                          fontFamily: "Arial",
                          fontSize: "20px",
                          textAlign: "left",
                        }}
                      >
                        Hi {userData.firstName},
                      </p>
                    </>
                  )}

                  {userData && (
                    <>
                      <br></br>
                      <h2>Stent Record</h2>

                      <br></br>
                      {userData.stentData.map((stent, index) => (
                        <div key={index}>
                          <Container>
                            {" "}
                            <p
                              style={{
                                position: "relative",
                                backgroundImage: `linear-gradient(${calculateColor(
                                  countdown(
                                    calculateDueDate(
                                      stent.insertedDate,
                                      stent.dueDate
                                    )
                                  ).days
                                )},${calculateColor(
                                  countdown(
                                    calculateDueDate(
                                      stent.insertedDate,
                                      stent.dueDate
                                    )
                                  ).days
                                )})`,
                                width: "100%", // Adjust the width as needed
                                height: "200px", // Adjust the height as needed
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center", // Align content at the top
                                alignItems: "center", // Align items at the left
                                padding: "10px", // Add padding to create space for the inner content
                                textAlign: "center",
                                fontFamily: "ds",
                                fontSize: "50px",
                                borderRadius: "10px",
                                color: "#fff",
                              }}
                            >
                              <p
                                style={{
                                  position: "absolute",
                                  top: "10px",
                                  left: "10px",
                                  fontFamily: "Arial",
                                  fontSize: "20px",
                                  textAlign: "left",
                                }}
                              >
                                Removal Date:{" "}
                                {calculateDueDate(
                                  stent.insertedDate,
                                  stent.dueDate
                                )}
                              </p>
                              <AnimatedCountdown
                                insertedDate={formatDate(stent.insertedDate)}
                                dueDate={calculateDueDate(
                                  stent.insertedDate,
                                  stent.dueDate
                                )}
                              />
                            </p>
                          </Container>

                          <div className="row" style={{ position: "center" }}>
                            <div className="col-md-2">
                              <span className="inline-block">
                                <div
                                  style={{
                                    backgroundColor: "green",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                ></div>
                              </span>
                              <span className="inline-block block-label">
                                Active
                              </span>
                            </div>

                            <div className="col-md-2">
                              <span className="inline-block">
                                <div
                                  style={{
                                    backgroundColor: "yellow",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                ></div>
                              </span>
                              <span className="inline-block block-label">
                                Due
                              </span>
                            </div>

                            <div className="col-md-2">
                              <span className="inline-block">
                                <div
                                  style={{
                                    backgroundColor: "red",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                ></div>
                              </span>
                              <span className="inline-block block-label">
                                Expired
                              </span>
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
                                  <td>
                                    {calculateDueDate(
                                      stent.insertedDate,
                                      stent.dueDate
                                    )}
                                  </td>
                                  <td>{stent.placeOfInsertion}</td>
                                </tr>
                              </tbody>
                            </Table>
                            <div>
                              {" "}
                              <div>
                                <h2>Stent Records</h2>
                                <Table striped bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>Case ID</th>
                                      <th>Hospital Name</th>
                                      <th>Laterality</th>
                                      <th>Inserted Date</th>
                                      <th>Duration</th>
                                      {/* Add more headers based on the data */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {records.map((record, index) => {
                                      // Sort stentData by insertedDate in descending order

                                      return (
                                        <tr key={record._id}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {record.stentData
                                              .map((stent) => stent.caseId)
                                              .join(", ")}
                                          </td>
                                          <td>
                                            {record.stentData
                                              .map(
                                                (stent) => stent.hospitalName
                                              )
                                              .join(", ")}
                                          </td>
                                          <td>
                                            {record.stentData
                                              .map((stent) => stent.laterality)
                                              .join(", ")}
                                          </td>
                                          <td>
                                            {record.stentData
                                              .map((stent) =>
                                                formatDate(stent.insertedDate)
                                              )
                                              .join(", ")}
                                          </td>
                                          <td>
                                            {record.stentData
                                              .map((stent) => stent.dueDate)
                                              .join(", ")}
                                          </td>
                                          {/* Add more data cells based on the data */}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </div>

                            <div>
                              {" "}
                              <div>
                                <h2>Remove Stent Records</h2>
                                <Table striped bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>Case ID</th>
                                      <th>Hospital Name</th>
                                      <th>Laterality</th>
                                      <th>Remove by</th>
                                      <th>Removal Date</th>
                                      {/* Add more headers based on the data */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {removeRecords.map((record, index) => {
                                      // Sort stentData by insertedDate in descending order

                                      return (
                                        <tr key={record._id}>
                                          <td>{index + 1}</td>
                                          <td>{record.caseId}</td>
                                          <td>{record.removalLocation}</td>
                                          <td>{record.laterality}</td>
                                          <td>{record.removedBy}</td>

                                          <td>
                                            {formatDate(record.timestamp)}
                                          </td>
                                          {/* Add more data cells based on the data */}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </div>

                            <div>
                              {" "}
                              <div>
                                <h2>Replace Stent Records</h2>
                                <Table striped bordered hover responsive>
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>Old Case ID</th>
                                      <th>New Case ID</th>
                                      <th>Hospital Name</th>
                                      <th>Laterality</th>
                                      <th>Remove by</th>
                                      <th>Removal Date</th>
                                      {/* Add more headers based on the data */}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {replaceRecords.map((record, index) => {
                                      // Sort stentData by insertedDate in descending order

                                      return (
                                        <tr key={record._id}>
                                          <td>{index + 1}</td>
                                          <td>{record.removedStent.caseId}</td>
                                          <td>{record.newStent.caseId}</td>
                                          <td>
                                            {
                                              record.removedStent
                                                .removalLocation
                                            }
                                          </td>
                                          <td>
                                            {record.removedStent.laterality}
                                          </td>
                                          <td>
                                            {record.removedStent.removedBy}
                                          </td>

                                          <td>
                                            {formatDate(record.timestamp)}
                                          </td>
                                          {/* Add more data cells based on the data */}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Container>
                          {/* Add more stent data fields as needed */}
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : activeTab === "staff" ? (
                // Content for staff
                <>
                  {userData.position === "admin" && (
                    // Content for admin
                    <>
                      <>
                        <p
                          style={{
                            position: "relative",
                            top: "10px",
                            left: "10px",
                            fontFamily: "Arial",
                            fontSize: "20px",
                            textAlign: "left",
                          }}
                        >
                          Welcome {userData.firstName}
                          {userData.surname} To NUST,
                        </p>
                        <p
                          style={{
                            position: "relative",
                            top: "10px",
                            left: "10px",
                            fontFamily: "Arial",
                            fontSize: "20px",
                            textAlign: "left",
                          }}
                        >
                          You are under Hospital {userData.hospitalName}
                        </p>
                        <Button
                          variant="primary"
                          onClick={handleShowPatientList}
                        >
                          Show Patient List
                        </Button>
                        <Button variant="primary" onClick={handleShowUserList}>
                          Show User List
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShowApplicationList}
                        >
                          Show Application List
                        </Button>
                        <Image
                          src="./MML.png"
                          alt="Logo"
                          fluid
                          style={{ width: "100px", height: "auto" }}
                        />
                        <Image
                          src={`/images/${userData.image}`}
                          alt="Profile Image"
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
                            <p>
                              Permissions: {roleData.permissions.join(", ")}
                            </p>
                          </>
                        )}
                      </>
                      <Button variant="primary" onClick={handleShowUserList}>
                        Show User List
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleShowApplicationList}
                      >
                        Show Application List
                      </Button>
                      {/* Other admin-specific content */}
                    </>
                  )}

                  {userData.position === "superAdmin" && (
                    // Content for superAdmin
                    <>
                      <Container>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <h1 className="left-align">
                            Hi{" "}
                            {userData &&
                              userData.firstName + userData.surname + ","}
                          </h1>
                        </div>
                      </Container>
                      <Button variant="primary" onClick={handleShowPatientList}>
                        Show Patient List
                      </Button>
                      <Button variant="primary" onClick={handleShowUserList}>
                        Show User List
                      </Button>
                      <Button variant="primary" onClick={handleResearch}>
                        Research User List
                      </Button>
                      <Container>
                        <Row className="mt-3 mb-3">
                          <Col md={3}>
                            <h1>PATIENT LIST</h1>
                          </Col>
                          <Col md={5}></Col>
                          <Col md={4} className="d-flex justify-content-end">
                            <InputGroup className="mb-3">
                              <Form.Control
                                type="text"
                                placeholder="Search by criteria..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <InputGroup.Text>
                                <BsSearch />
                              </InputGroup.Text>
                            </InputGroup>
                          </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>NO</th>
                              <th>MRN NO</th>

                              <th>Name</th>
                              <th>Birthday</th>
                              <th>IC NO</th>
                              <th>Gender</th>
                              <th>Mobile NO</th>
                              <th>No of stent(s)</th>
                              <th>Opearations</th>
                              {/* Add more headers as needed */}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPatients.map((patients, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{patients.mrnNo}</td>
                                <td>
                                  {patients.firstName}
                                  {patients.surname}
                                </td>
                                <td>{formatDate(patients.dob)}</td>
                                <td>{patients.icNo}</td>
                                <td>{patients.gender}</td>
                                <td>{patients.mobileNo}</td>
                                <td>{patients.stentData.length}</td>
                                <td className="text-center">
                                  <Link to={`/showStent/${patients._id}`}>
                                    <Button variant="primary">
                                      {" "}
                                      Show Stent
                                    </Button>
                                  </Link>
                                  <Link to={`/showPatientByID/${patients._id}`}>
                                    <Button
                                      variant="light"
                                      className="transparent-button"
                                    >
                                      <MdOutlineSearch className="blue-icon icon-large" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="light"
                                    className="transparent-button"
                                    onClick={() => handleEditClick(patients)}
                                  >
                                    <MdOutlineEmail className="brown-icon icon-large" />
                                  </Button>
                                  <Link
                                    to={`/updatePatientByID/${patients._id}`}
                                  >
                                    <Button
                                      variant="light"
                                      className="transparent-button"
                                    >
                                      <MdOutlineEdit className="black-icon icon-large" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="light"
                                    className="transparent-button"
                                    onClick={() => handleDeleteClick(patients)}
                                  >
                                    <MdOutlineDelete className="red-icon icon-large" />
                                  </Button>
                                </td>
                                {/* Add more patient data as needed */}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Link to="/addPatient">
                            <Button>
                              <h5>+</h5>
                            </Button>
                          </Link>
                        </div>
                        <br></br>
                      </Container>
                      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
                        <Modal.Header closeButton>
                          <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {patientToDelete && (
                            <p>
                              Are you sure you want to delete{" "}
                              {patientToDelete.firstName}{" "}
                              {patientToDelete.surname}?
                            </p>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={handleCancelDelete}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            onClick={handleConfirmDelete}
                          >
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {/* Success Modal */}
                      <Modal
                        show={showSuccessModal}
                        onHide={() => setShowSuccessModal(false)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Success</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <p>Patient deleted successfully.</p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="primary"
                            onClick={() => setShowSuccessModal(false)}
                          >
                            OK
                          </Button>
                        </Modal.Footer>
                      </Modal>{" "}
                      {/* Other superAdmin-specific content */}
                    </>
                  )}
                  {userData.position === "doctor" && (
                    // Content for doctor
                    <>
                      <Row
                        className="mx-auto"
                        style={{ maxWidth: "100%", padding: "5px" }}
                      >
                        <Col className="text-start">
                          <h3 style={{ color: "#3b5998" }}>
                            Welcome Back{", "}
                            {userData && userData.firstName + userData.surname}
                          </h3>
                        </Col>
                      </Row>
                      <Row
                        className="mx-auto"
                        style={{
                          maxWidth: "100%",
                          backgroundColor: "transparent",
                          padding: "20px",
                        }}
                      >
                        <Col>
                          <Button
                            style={{
                              background: "transparent",
                              border: "transparent",
                              color: "#000",
                            }}
                            onClick={allPatient}
                          >
                            <Card
                              style={{
                                width: "15rem",
                                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Card.Body>
                                <Card.Title
                                  style={{
                                    color: "green",
                                  }}
                                >
                                  All
                                </Card.Title>
                                <Card.Text
                                  style={{
                                    fontSize: 50,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {allPatientData.length}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            style={{
                              background: "transparent",
                              border: "transparent",
                              color: "#000",
                            }}
                            onClick={activePatient}
                          >
                            <Card
                              style={{
                                width: "15rem",
                                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Card.Body>
                                <Card.Title style={{ color: "green" }}>
                                  Active
                                </Card.Title>
                                <Card.Text
                                  style={{
                                    fontSize: 50,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {activePatientData.length}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            style={{
                              background: "transparent",
                              border: "transparent",
                              color: "#000",
                            }}
                            onClick={duePatient}
                          >
                            <Card
                              style={{
                                width: "15rem",
                                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Card.Body>
                                <Card.Title style={{ color: "orange" }}>
                                  Due
                                </Card.Title>
                                <Card.Text
                                  style={{
                                    fontSize: 50,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {duePatientData.length}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            style={{
                              background: "transparent",
                              border: "transparent",
                              color: "#000",
                            }}
                            onClick={expiredPatient}
                          >
                            <Card
                              style={{
                                width: "15rem",
                                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Card.Body>
                                <Card.Title style={{ color: "red" }}>
                                  Expired
                                </Card.Title>
                                <Card.Text
                                  style={{
                                    fontSize: 50,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {expiredPatientData.length}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Button>
                        </Col>
                      </Row>
                      <Container
                        style={{
                          padding: "15px 40px",
                          backgroundColor: "white",
                          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Row
                          className="mx-auto"
                          style={{ maxWidth: "100%", padding: "5px" }}
                        >
                          <Col className="text-start">
                            <h4 style={{ color: "#3b5998" }}>Patient Record</h4>
                          </Col>
                        </Row>
                        <Tabs
                          activeKey={activeDoctorTab}
                          onSelect={(tabKey) => handleTabChange(tabKey)}
                          defaultActiveKey="myPatient"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                        >
                          <Tab eventKey="myPatient" title="My Patient">
                            <Row>
                              <MDBTable align="middle">
                                <MDBTableHead>
                                  <tr class="table-primary">
                                    <th scope="col">Name</th>
                                    <th scope="col">IC Number</th>
                                    <th scope="col">Hospital MRN</th>
                                    <th scope="col">Mobile Number</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {patientData.map((patient) => (
                                    <tr key={patient.id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="ms-3">
                                            <p className="fw-bold mb-1">
                                              {patient.firstName +
                                                " " +
                                                patient.surname}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.icNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.mrnNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.mobileNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.email}
                                        </p>
                                      </td>
                                      <td>
                                        <MDBBadge color="success" pill>
                                          Active
                                        </MDBBadge>
                                      </td>
                                      <td className="text-center">
                                        <Link to={`/showStent/${patient._id}`}>
                                          <Button
                                            style={{
                                              backgroundColor: "#3b5998",
                                            }}
                                            size="sm"
                                          >
                                            {" "}
                                            Show Stent
                                          </Button>
                                        </Link>
                                        <Link
                                          to={`/showPatientByID/${patient._id}`}
                                        >
                                          <Button
                                            variant="light"
                                            className="transparent-button"
                                          >
                                            <MdOutlineSearch className="blue-icon icon-large" />
                                          </Button>
                                        </Link>
                                        <Button
                                          variant="light"
                                          className="transparent-button"
                                          onClick={() =>
                                            handleEditClick(patient)
                                          }
                                        >
                                          <MdOutlineEmail className="brown-icon icon-large" />
                                        </Button>
                                        <Link
                                          to={`/updatePatientByID/${patient._id}`}
                                        >
                                          <Button
                                            variant="light"
                                            className="transparent-button"
                                          >
                                            <MdOutlineEdit className="black-icon icon-large" />
                                          </Button>
                                        </Link>
                                        <Button
                                          variant="light"
                                          className="transparent-button"
                                          onClick={() =>
                                            handleDeleteClick(patient)
                                          }
                                        >
                                          <MdOutlineDelete className="red-icon icon-large" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </MDBTableBody>
                              </MDBTable>
                            </Row>
                          </Tab>
                          <Tab
                            eventKey="hospitalPatient"
                            title="My Hospital Patient"
                          >
                            <Row>
                              <MDBTable align="middle">
                                <MDBTableHead>
                                  <tr class="table-primary">
                                    <th scope="col">Name</th>
                                    <th scope="col">IC Number</th>
                                    <th scope="col">Hospital MRN</th>
                                    <th scope="col">Mobile Number</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {patientData.map((patient) => (
                                    <tr key={patient.id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="ms-3">
                                            <p className="fw-bold mb-1">
                                              {patient.firstName +
                                                " " +
                                                patient.surname}
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.icNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.mrnNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.mobileNo}
                                        </p>
                                      </td>
                                      <td>
                                        <p className="fw-normal mb-1">
                                          {patient.email}
                                        </p>
                                      </td>
                                      <td>
                                        <MDBBadge color="success" pill>
                                          Active
                                        </MDBBadge>
                                      </td>
                                      <td className="text-center">
                                        <Link to={`/showStent/${patient._id}`}>
                                          <Button variant="primary">
                                            {" "}
                                            Show Stent
                                          </Button>
                                        </Link>
                                        <Link
                                          to={`/showPatientByID/${patient._id}`}
                                        >
                                          <Button
                                            variant="light"
                                            className="transparent-button"
                                          >
                                            <MdOutlineSearch className="blue-icon icon-large" />
                                          </Button>
                                        </Link>
                                        <Button
                                          variant="light"
                                          className="transparent-button"
                                          onClick={() =>
                                            handleEditClick(patient)
                                          }
                                        >
                                          <MdOutlineEmail className="brown-icon icon-large" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </MDBTableBody>
                              </MDBTable>
                            </Row>
                          </Tab>
                        </Tabs>
                      </Container>
                    </>
                  )}
                </>
              ) : (
                // Handle other cases or show an error message
                <p>Error: Invalid user type</p>
              )}
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
        <div
          style={{
            backgroundImage: "#0095ff",
          }}
        >
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
