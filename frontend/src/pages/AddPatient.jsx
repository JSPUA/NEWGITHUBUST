import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Card,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAngleLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../pages/userAction.js";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function AddPatient() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState("");
  const [showPasswordMismatchModal, setShowPasswordMismatchModal] =
    useState(false);
  const saltRounds = 10;
  const [lastMrnNo, setLastMrnNo] = useState(0);
  const [formData, setFormData] = useState({
    // ... your form data fields
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  //const icNo = location.state ? location.state.icNo : null;
  //const activeTab =location.state ? location.state.activeTab : null;
  const position = location.state ? location.state.position : null;
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [patientRoleData, setPatientRoleData] = useState(null);
  const [hospitalNames, setHospitalNames] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
  const { icNo, activeTab } = useSelector((state) => state.user);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);

  let profileImageSrc = "/images/DefaultProfilePic.jpg";

  const isPermissionInRole = (permission) => {
    return roleData
      ? roleData.permissions.includes(permission)
      : patientRoleData && patientRoleData.permissions.includes(permission);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5555/logout");
      if (response.data.success) {
        console.log("Logout");
        // Redirect to the login page or perform any other necessary actions
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
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

  const handleHospitalSelect = async (hospital) => {
    setSelectedHospital(hospital);
  };

  useEffect(() => {
    // Fetch additional user data based on the stored token or user information
    const fetchUserData = async () => {
      try {
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

  useEffect(() => {
    // Fetch the last MRN No when the component mounts
    axios
      .get("http://localhost:5555/getLastMrnNo")
      .then((response) => {
        setLastMrnNo(response.data.lastMrnNo);
        console.log(lastMrnNo);
      })
      .catch((error) => {
        console.error("Error fetching last MRN No:", error);
      });
  }, []);

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

  const sendOTP = async (e) => {
    validatePasswords();

    if (!passwordsMatch) {
      // Passwords don't match, show the password mismatch modal
      setShowPasswordMismatchModal(true);
      return;
    }

    const patientData = {
      firstName: formData.firstName,
      surname: formData.surname,
      dob: formData.dob,
      icNo: formData.icNo,
      gender: formData.gender,
      mrnNo: formData.mrnNo,
      mobileNo: mobile,
      email: formData.email,
      nextOfKin: {
        firstName: formData.nextOfKinFirstName,
        surname: formData.nextOfKinSurname,
        mobileNo: formData.nextOfKinMobileNo,
      },
      password: password,
      verified: false,
    };

    const registration = await fetch("http://localhost:5555/addPatients", {
      method: "POST",
      body: JSON.stringify(patientData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await registration.json();
    console.log(json);

    const response = fetch("http://localhost:5555/api/sms", {
      method: "POST",
      body: JSON.stringify({ mobileNo: mobile }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("mobile", mobile);
    setIsOtpSent(true);
    setShowModal(true);
    console.log("OTP sent", response.data);
  };

  const handleVerifyOtp = async () => {
    try {
      // Make a request to verify the entered OTP
      const verifyOtp = await axios.post(
        "http://localhost:5555/api/sms/verify",
        {
          mobileNo: mobile,
          enteredOTP: otp,
        }
      );

      setVerified(true);
      console.log(verifyOtp.data);

      const application = {
        verified: true,
      };

      const response = await fetch(
        `http://localhost:5555/api/sms/patient/${mobile}`,
        {
          method: "PUT",
          body: JSON.stringify(application),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }

      if (response.ok) {
        setFormData({
          firstName: "",
          surname: "",
          dob: "",
          icNo: "",
          gender: "",
          mrnNo: "",
          mobileNo: "",
          email: "",
          nextOfKinName: "",
          nextOfKinContact: "",
          ethnicity: "",
          password: "",
          retypePassword: "",
          nextOfKinMobileNo: "",
          nextOfKinFirstName: "",
          nextOfKinSurname: "",
        });
      }

      console.log("User account registered", json);
      setShowModal(false);
      setShowSuccessModal(true);
      setIsOtpSent(false);
      setMobile("");
      setOtp("");

      setError(null);
    } catch (error) {
      console.error(error);
      // Handle error message, e.g., show an error message to the user
    }
  };

  const submitPatient = async (e) => {
    e.preventDefault();
    sendOTP();
    // validatePasswords();

    // if (!passwordsMatch) {
    //   // Passwords don't match, show the password mismatch modal
    //   setShowPasswordMismatchModal(true);
    //   return;
    // }

    // const patientData = {
    //   ...formData,
    //   password,
    // };

    // try {
    //   const response = await axios.post(
    //     "http://localhost:5555/addPatients",
    //     patientData
    //   );

    //   setShowSuccessModal(true);
    // } catch (error) {
    //   console.error("Error adding patient:", error);
    // }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswords = () => {
    setPasswordsMatch(formData.password === retypePassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleClosePasswordMismatchModal = () => {
    setShowPasswordMismatchModal(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // Check if passwords match when the password field changes
    setPasswordsMatch(event.target.value === retypePassword);
  };

  const handleRetypePasswordChange = (event) => {
    setRetypePassword(event.target.value);
    // Check if passwords match when the retype password field changes
    setPasswordsMatch(password === event.target.value);
  };

  return (
    <div>
      <div>
        {userData ? (
          <>
            {(activeTab && activeTab === "patient") ||
            userData.position === "admin" ||
            userData.position === "doctor" ? (
              <>
                <Navbar bg="light" expand="lg">
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
                        <NavDropdown
                          title="Patients"
                          id="nav-patients-dropdown"
                        >
                          {(isPermissionInRole("addPatient") ||
                            isPermissionInRole("viewPatient") ||
                            isPermissionInRole("editPatient") ||
                            isPermissionInRole("deletePatient")) && (
                            <NavDropdown
                              title="Patients"
                              id="nav-patients-dropdown"
                            >
                              {isPermissionInRole("addPatient") && (
                                <NavDropdown.Item as="div">
                                  <Link
                                    to={{
                                      pathname: "/addPatient",
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
                                    Add Patients
                                  </Link>
                                </NavDropdown.Item>
                              )}
                              {isPermissionInRole("viewPatient") && (
                                <NavDropdown.Item href="/showPatient">
                                  View Patients
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
                          {isPermissionInRole("viewPatient") && (
                            <NavDropdown.Item href="/showPatient">
                              View Patients
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
                        <NavDropdown
                          title="Research"
                          id="nav-research-dropdown"
                        >
                          {isPermissionInRole("viewResearch") && (
                            <NavDropdown.Item
                              onClick={() => navigate("/researchList")}
                            >
                              View Research
                            </NavDropdown.Item>
                          )}
                          {isPermissionInRole("addResearch") && (
                            <NavDropdown.Item href="/uploadPDF">
                              Add Research
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
                                : userData.profilePic) ||
                              "DefaultProfilePic.jpg"
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
                <Navbar bg="light" expand="lg">
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
                        <NavDropdown
                          title="Patients"
                          id="nav-patients-dropdown"
                        >
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
                            <NavDropdown.Item href="/showPatient">
                              View Patients
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
                        <NavDropdown
                          title="Research"
                          id="nav-research-dropdown"
                        >
                          {isPermissionInRole("viewResearch") && (
                            <NavDropdown.Item href="/researchList">
                              View Research
                            </NavDropdown.Item>
                          )}
                          {isPermissionInRole("addResearch") && (
                            <NavDropdown.Item href="/uploadPDF">
                              Add Research
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
                                : userData.profilePic) ||
                              "DefaultProfilePic.jpg"
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
      </div>
      <Container>
        <Card
          style={{
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <Link to="/login">
                <FontAwesomeIcon icon={faAngleLeft} />
              </Link>{" "}
              Back
            </div>
            <div className="text-center">
              <Image
                src="./MML.png"
                alt="Logo"
                fluid
                style={{ width: "100px", height: "auto" }}
                className="mx-auto"
              />
            </div>
          </Card.Header>
          <div className="card">
            <div className="card-body">
              <h3>Personal Biodata</h3>
              <form onSubmit={submitPatient} className="mb-3">
                <div className="row">
                  <div className="col-md-4">
                    {/* Include form fields for patient information */}
                    <div className="form-group">
                      <label>First Name:</label>
                      <input
                        type="text"
                        placeholder="Enter First Name"
                        name="firstName"
                        value={formData.firstName}
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
                        placeholder="Enter Surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Date of Birth:</label>
                      <input
                        type="Date"
                        placeholder="Enter Date of Birth"
                        name="dob"
                        value={formData.dob}
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
                      <label>MRN No:</label>
                      <input
                        type="number"
                        placeholder="Enter MRN No"
                        name="mrnNo"
                        value={formData.mrnNo}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>IC No:</label>
                      <input
                        type="number"
                        placeholder="Enter IC No"
                        name="icNo"
                        value={formData.icNo}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
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
                      <label>Mobile No:</label>
                      <input
                        type="text"
                        placeholder="Enter Mobile No"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={(e) => {
                          handleInputChange(e);
                          setMobile(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        value={formData.email}
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
                        placeholder="Enter Ethnicity"
                        name="ethnicity"
                        value={formData.ethnicity}
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
                      <label>Hospital</label>
                      <select
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="">Select Hospital</option>
                        <option value="HSAAS">HSAAS</option>
                        <option value="HUKM">HUKM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Password:</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        required
                      />
                      <div className="input-group-append">
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={handleTogglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          />{" "}
                          Show Password
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Retype Password:</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="retypePassword"
                        placeholder="Retype password"
                        value={retypePassword}
                        onChange={handleRetypePasswordChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {passwordsMatch ? (
                    <p>Passwords match.</p>
                  ) : (
                    <p>Passwords do not match.</p>
                  )}
                </div>
                <hr />
                <h3>Next Of Kin's Biodata</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Next of Kin First Name:</label>
                      <input
                        type="text"
                        placeholder="Enter Next of Kin First Name"
                        name="nextOfKinFirstName"
                        value={formData.nextOfKinFirstName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Next of Kin Surname:</label>
                      <input
                        type="text"
                        placeholder="Enter Next of Kin Surname"
                        name="nextOfKinSurname"
                        value={formData.nextOfKinSurname}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Next of Kin Mobile No:</label>
                      <input
                        type="number"
                        placeholder="Enter Next of Kin Mobile No"
                        name="nextOfKinMobileNo"
                        value={formData.nextOfKinMobileNo}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <br></br>
                {/* Add a submit button */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>

              {/* OTP Verification Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleVerifyOtp}>
                    Verify OTP
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Success modal */}
              <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{
                      fontSize: "3rem",
                      color: "orange",
                      marginBottom: "1rem",
                    }}
                  />
                  <p>
                    You have successfully submitted the patient's information.
                    {/* Add any success message here */}
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleCloseSuccessModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal
                show={showPasswordMismatchModal}
                onHide={handleClosePasswordMismatchModal}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Password Mismatch</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{
                      fontSize: "3rem",
                      color: "orange",
                      marginBottom: "1rem",
                    }}
                  />
                  <p>
                    The entered password and retype password do not match.
                    Please make sure they are the same.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={handleClosePasswordMismatchModal}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default AddPatient;
