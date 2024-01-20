import React,{useState, useRef,useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import {Navbar, Container,Nav, NavDropdown,Button,Image,Carousel,Dropdown,Row,Col} from 'react-bootstrap'
import { FaGlobe,FaSignInAlt,FaUser, FaWhatsapp } from 'react-icons/fa';

import LoginPage from '../pages/LoginPage'
import Upload from '../pages/upload';
import { MdOutlineMail,MdOutlinePhone } from 'react-icons/md';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('http://localhost:5555/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    console.log('Subscription sent to server successfully.');
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
  }
}

async function unsubscribeAndResubscribe() {
  const swRegistration = await navigator.serviceWorker.ready;
  const subscription = await swRegistration.pushManager.getSubscription();
  
  if (subscription) {
    await subscription.unsubscribe();
    console.log('Unsubscribed from push notifications');
  }

  // This is your new VAPID public key that should be stored in .env or a config file
  const newVapidPublicKey = 'BH009TIykrF5IwMRCR0fjSrCotnMkOZY3Ahag7ZpzewDMSjml9DYaW4-uX8N7H3ljZP_Y_VhyyjmiSk0HKv-J94'; // replace with your actual key
  const convertedVapidKey = urlBase64ToUint8Array(newVapidPublicKey);

  const newSubscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  console.log('New subscription:', newSubscription);
  await sendSubscriptionToServer(newSubscription);
}


const Home = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      unsubscribeAndResubscribe();
    }
  }, []);

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const ResourcesdropdownRef = useRef(null);

  const handleResourcesMouseEnter = () => {
    setIsResourcesDropdownOpen(true);
  };

  const handleResourcesMouseLeave = () => {
    setIsResourcesDropdownOpen(false);
  };

  const registerServiceWorkerAndSubscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        // Assuming your React app is being served from the 'public' directory and 'worker.js' is in the root of 'public'
        const registration = await navigator.serviceWorker.register('/worker.js');
  
        console.log('Service Worker Registered');
  
        // Wait until the service worker is active
        await navigator.serviceWorker.ready;
  
        console.log('Service Worker is active');
  
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BH009TIykrF5IwMRCR0fjSrCotnMkOZY3Ahag7ZpzewDMSjml9DYaW4-uX8N7H3ljZP_Y_VhyyjmiSk0HKv-J94'),
        });
  
        console.log('Push Subscription:', subscription);
  
        await sendSubscriptionToServer(subscription);
        console.log('Subscription sent to server');
      } catch (error) {
        console.error('Service Worker registration or push subscription failed:', error);
      }
    }
  };
  

  return (
    <div>
      <div>
        
      </div>
          <div>
      <div>
    <Navbar expand="lg" className="bg-body-tertiary">
      
      <Navbar.Brand href="/">
      <Image src="./MML.png" alt="Logo" fluid style={{ width: '100px', height: 'auto' }} /> 
    </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">HOME</Nav.Link>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            <Nav onMouseEnter={handleResourcesMouseEnter} onMouseLeave={handleResourcesMouseLeave}>
            <NavDropdown
        show={isResourcesDropdownOpen}
        title="RESOURCES"
        id="basic-nav-dropdown"
        ref={ResourcesdropdownRef}
      >
        <NavDropdown.Item href="#action/public">For Public</NavDropdown.Item>
        <NavDropdown.Item href="#action/hp">
          For Healthcare Professional
        </NavDropdown.Item>
      </NavDropdown>
      </Nav>
            {/* <Link to="/research"><Nav.Link to="/research">RESEARCH</Nav.Link></Link> */}
            <Nav.Link as={Link} to="/researchList" className="no-underline-link">RESEARCH</Nav.Link>            
          </Nav>
          
          
          
          <Nav onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavDropdown
        show={isDropdownOpen}
        title={(
        "LANGUAGE"
        )}
        id="basic-nav-dropdown"
        ref={dropdownRef}
      >
        <NavDropdown.Item href="#action/3.1">English</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">BM</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">华文</NavDropdown.Item>
      </NavDropdown>
    </Nav>
          
          <Nav>
  <Link to="/login">
    <Button
      variant="primary"
      style={{
        backgroundColor: isButtonHovered ? 'darkblue' : 'blue',
        color: 'white',
        width: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      <span>Login</span>
      <FaSignInAlt />
    </Button>
  </Link>
</Nav>
        </Navbar.Collapse>
      
     
    </Navbar>
    </div>
    
    


    <Carousel data-bs-theme="dark" interval={5000}>
  <Carousel.Item className="custom-carousel-item">
    
      <img
        className="d-block w-100"
        src="malaysia2.jpg"
        alt="First slide"
        width="600" // Set your desired width
        height="600" // Set your desired height
      />
    
    <Carousel.Caption>
      <h5>First slide label</h5>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item className="custom-carousel-item">
    
      <img
        className="d-block w-100"
        src="malaysia1.png"
        alt="Second slide"
        width="600" // Set your desired width
        height="600" // Set your desired height
      />
   
    <Carousel.Caption>
      <h5>Second slide label</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item className="custom-carousel-item">
    
      <img
        className="d-block w-100"
        src="malaysia3.jpg"
        alt="Third slide"
        width="600" // Set your desired width
        height="600" // Set your desired height
      />
    
    <Carousel.Caption>
      <h5>Third slide label</h5>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
  
    
    
  </div>
  <br></br>
      <div>
      {/* <Link  to={`/booklist`}>
      <Button
            variant="primary"
            style={{
              backgroundColor: isButtonHovered ? 'darkblue' : 'blue',
              color: 'white', // Text color
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Show Book
          </Button>
</Link>  */}
<Link  to={`/upload`}><Button variant="outline-primary">Make application</Button></Link>
{/* <Link  to={`/applyList`}><Button variant="outline-primary">Apply list</Button></Link>
<Link  to={`/applyListFilter`}><Button variant="primary">Apply list filter</Button></Link> */}
<Link  to={`/sampleTable`}><Button variant="primary">Applying List</Button></Link>
<Link  to={`/uploadPDF`}><Button variant="primary">Research Upload</Button></Link>
<Link  to={`/researchList`}><Button variant="primary">Research List</Button></Link>
<Link  to={`/addPatient`}><Button variant="primary">Add Patient</Button></Link>

<Link  to={`/showPatient`}><Button variant="primary">Patient List</Button></Link>
<Link  to={`/sendEmail`}><Button variant="primary">Send Email</Button></Link>
<Link  to={`/rolePermission`}><Button variant="primary"> Role and Permission</Button></Link>
<Link  to={`/hospitalList`}><Button variant="primary"> Hospital List</Button></Link>
<Link  to={`/superAdmin`}><Button variant="primary"> Super Admin </Button></Link>
<Link  to={`/chart`}><Button variant="primary"> Chart </Button></Link>
<Link  to={`/dailyCount`}><Button variant="primary"> DailyChart </Button></Link>
<Link  to={`/specificDateCount`}><Button variant="primary"> SpecificTimeChart </Button></Link>
{/* <Link  to={`/addStent`}><Button variant="primary">Add Stent</Button></Link>
<Link  to={`/showStent`}><Button variant="primary">Show Stent</Button></Link>
<Link  to={`/combine`}><Button variant="primary">Combine</Button></Link>
<Link  to={`/showStent`}><Button variant="primary">Patient Stent</Button></Link>
<Link  to={`/bookList`}><Button variant="primary">Book</Button></Link> */}
      </div>
<br></br>
<hr></hr>
 <h1>About Us</h1> 
 <br></br> 
 <Container>
 <p>The Ureteral Stent Tracker application is a tool designed to help
   medical professionals and patients monitor and manage the placement 
   and removal of ureteral stents. Ureteral stents are thin tubes inserted
    into the urinary tract to improve urine flow or assist in healing 
    after surgeries. This application allows users to track the stent's 
    position, schedule follow-up appointments, set reminders for 
    medication or stent removal, and receive educational information 
    about stent care. It helps ensure better communication between
     patients and healthcare providers, leading to improved patient 
     outcomes and comfort during the stent management process.
</p>  
</Container> 
<br></br>
<hr></hr>
<h1>Contact </h1> 
<Container>
      <div className="row" >
        <div className="column">
        <MdOutlineMail />
        <Link to="mailto:email@gmail.com">email@gmail.com</Link>
        </div>
      </div>
      <div className="row">
      <div className="column">
        <FaWhatsapp />
        <span>+011 1111 1111</span>
      </div>
      </div>
      <div className="row">
      <div className="column">
        <MdOutlinePhone />
        <span>+606 978 1111</span>
      </div>
      </div>
    </Container>

    </div>
  )
}
//p=2 bg-sky-300 m-8 
export default Home