import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Image,
  Card,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../pages/userAction.js";

function LoginForm() {
  //new
  const [email, setEmail] = useState("");
  const [icNo, setIcNo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("staff");
  const dispatch = useDispatch();
  const newhandleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url =
        activeTab === "staff"
          ? "http://localhost:5555/staffLogin"
          : "http://localhost:5555/login";
      const response = await axios.post(url, {
        email,
        password,
        icNo,
      });

      if (response.data.success) {
        console.log("Login Success");
        const userIcNo = response.data.icNo;
        const userActiveTab = activeTab;
        alert("Login successful!");

        dispatch(setUser({ icNo: userIcNo, activeTab: userActiveTab }));

        if (activeTab === "staff") {
          // Make request for staff data
          const staffResponse = await axios.get(
            `http://localhost:5555/getStaffByEmail/${icNo}`
          );
          console.log("Staff data:", staffResponse.data.staff);
        } else {
          // Make request for patient data
          const patientResponse = await axios.get(
            `http://localhost:5555/getPatientByEmail/${icNo}`
          );
          console.log("Patient data:", patientResponse.data.patient);
        }
        // Assuming the response has a token
        const { token } = response.data;

        // Store the token securely (e.g., in an HTTP-only cookie)
        // For simplicity, let's use local storage in this example
        localStorage.setItem("authToken", token);

        // Redirect to home page
        navigate("/mainPage", {
          state: {
            activeTab: userActiveTab,
            icNo: userIcNo,

            // Add more properties as needed
          },
        });
      } else {
        alert("Incorrect email or password! Please try again.");
        console.log(icNo);
        console.log(password);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  //new

  const [formData, setFormData] = useState({
    firstName: "",
    password: "",
    showError: false,
    showPassword: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, password } = formData;
    try {
      const response = await axios.post(
        `http://localhost:5555/api/login/${firstName}`,
        {
          password,
        }
      );

      if (response.status === 200) {
        // Successful login
        alert("Login successful");
        console.log("Login successful");
        return navigate(`/patientPage/${firstName}`);
      } else {
        // Failed login
        setFormData((prevData) => ({
          ...prevData,
          showError: true,
        }));
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error as needed
    }
  };

  const linkStyle = {
    color: "blue",
    textDecoration: "underline",
  };
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div>
      {/* <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Link to="/"> <FontAwesomeIcon icon={faAngleLeft} /></Link> Back
              </div>
              <div className="text-center">
                <Image
                  src="./MML.png"
                  alt="Logo"
                  fluid
                  style={{ width: '100px', height: 'auto' }}
                  className="mx-auto"
                />
              </div>
            </Card.Header>
            <br></br>
            <Card.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <br></br>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={formData.showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="input-group-append">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={handleTogglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={formData.showPassword ? faEye : faEyeSlash}
                        />
                      </Button>
                    </div>
                  </div>
                </Form.Group>

                {formData.showError && (
                  <Alert variant="danger">Invalid username or password</Alert>
                )}
                <br></br>
                <div className="d-flex justify-content-end">
                
                <Button
                type='submit'
      variant="primary"
      style={{
        
        width: '100px',
       
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      Login
      
    </Button>
    
                </div>
              </Form>

              <div className="mt-3">
                <p>
                  <Link to="/forgetpassword" style={linkStyle}>Forgot Password?</Link>
                </p>
                <p>
                  Don't have an account? <Link to="/upload" style={linkStyle}>Sign Up</Link> now!
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      <div>
        <div
          className="d-flex justify-content-center align-items-center text-center vh-100"
          style={{}}
        >
          <div
            className="bg-white p-3 rounded"
            style={{
              width: "40%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "20px",
            }}
          >
            <h2 className="mb-3 text-primary">Login</h2>
            <Tabs
              id="login-tabs"
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
              className="mb-3"
            >
              <Tab eventKey="staff" title="Staff">
                {/* Content for Staff Login */}
                <form onSubmit={newhandleSubmit}>
                  <div className="mb-3 text-start">
                    <label htmlFor="exampleInputIC" className="form-label">
                      <strong>IC NO</strong>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter IC No"
                      className="form-control"
                      id="exampleInputIC"
                      onChange={(event) => setIcNo(event.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div> */}
                  <div className="mb-3 text-start">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      <strong>Password</strong>
                    </label>
                    <div className="input-group">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={handleTogglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={formData.showPassword ? faEye : faEyeSlash}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p>
                    <Link to="/forgetpassword" style={linkStyle}>
                      Forgot Password?
                    </Link>
                  </p>
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
                <p className="container my-2">Don&apos;t have an account?</p>
                <Link to="/upload" className="btn btn-secondary">
                  Sign Up
                </Link>
              </Tab>
              <Tab eventKey="patient" title="Patient">
                {/* Content for Patient Login */}
                <form onSubmit={newhandleSubmit}>
                  <div className="mb-3 text-start">
                    <label htmlFor="exampleInputIC" className="form-label">
                      <strong>IC NO</strong>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter IC No"
                      className="form-control"
                      id="exampleInputIC"
                      onChange={(event) => setIcNo(event.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <div className="input-group-append">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={handleTogglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={formData.showPassword ? faEye : faEyeSlash}
                        />
                      </Button>
                    </div>
            </div> */}
                  <div className="mb-3 text-start">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      <strong>Password</strong>
                    </label>
                    <div className="input-group">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <Button
                          variant="outline-secondary"
                          type="button"
                          onClick={handleTogglePasswordVisibility}
                        >
                          <FontAwesomeIcon
                            icon={formData.showPassword ? faEye : faEyeSlash}
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p>
                    <Link to="/forgetpassword" style={linkStyle}>
                      Forgot Password?
                    </Link>
                  </p>

                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
