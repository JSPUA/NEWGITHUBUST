import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form,InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdOutlineDelete, MdOutlineEdit,MdOutlineSearch,MdOutlineAdd } from 'react-icons/md';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../pages/userAction.js';
import Navbars from '../pages/Navbar.jsx'

function ResearchList() {
  const [pdfData, setPDFData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { icNo, activeTab } = useSelector((state) => state.user);


  if (!icNo || !activeTab) {
    console.log("Either icNo or activeTab or both are empty");
    // Handle the case where they are empty
  } else {
    console.log(`icNo: ${icNo}, activeTab: ${activeTab}`);
    // Continue with your logic as they are not empty
  }

  const handlePdfFileUpload = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const handlePictureFileUpload = (event) => {
    const file = event.target.files[0];
    setPictureFile(file);
  };

  // Edit form state
  const [editedPdf, setEditedPdf] = useState({
    title: '',
    description: '',
    pdfFile: '',
    picture: '',
  });

  const handleEditClick = (pdf) => {
    setSelectedPdf(pdf);
    setEditedPdf({
      title: pdf.title,
      description: pdf.description,
      pdfFile: pdf.pdfFileName,
      picture: pdf.picture,
    });
    setShowEditModal(true);
  };

  useEffect(() => {
    // Fetch PDF data when the component mounts
    axios
      .get('http://localhost:5555/pdf-upload')
      .then((response) => {
        setPDFData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PDF data:', error);
      });
  }, []);

  const handleDeleteClick = (id) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const handleEditSubmit = () => {
    // Create a FormData object to send the updated data, PDF file, and picture file
    const formData = new FormData();

    // Append the updated data fields
    formData.append('title', editedPdf.title);
    formData.append('description', editedPdf.description);

    // Append the updated PDF file (if it's selected)
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    } else {
      // If no new PDF file is selected, use the existing PDF file name
      formData.append('pdfFileName', editedPdf.pdfFile);
    }

    // Append the updated picture file (if it's selected)
    if (pictureFile) {
      formData.append('picture', pictureFile);
    } else {
      // If no new picture file is selected, use the existing picture file name
      formData.append('pictureFileName', editedPdf.picture);
    }

    // Use axios to send the form data to the server for editing
    axios
      .put(`http://localhost:5555/pdf-upload/${selectedPdf._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Handle success, close the edit modal, and refresh the PDF data
        setShowEditModal(false);
        setShowSuccessModal(true);
        // Refresh PDF data
      })
      .catch((error) => {
        console.error('Error editing PDF data:', error);
        // Handle errors as needed
      });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    // Refresh the page by reloading the PDF data
    axios
      .get('http://localhost:5555/pdf-upload')
      .then((response) => {
        setPDFData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PDF data:', error);
      });
  };

  const handleDeleteConfirm = () => {
    // Send a DELETE request to your API to delete the specific item by ID
    axios
      .delete(`http://localhost:5555/pdf-upload/${deleteItemId}`)
      .then(() => {
        // Close the delete modal
        setShowDeleteModal(false);

        // Show the success modal
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error('Error deleting PDF data:', error);
        // Handle errors as needed
      });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
  };

  const filteredPDFData = pdfData.filter((pdf) => {
    const titleMatch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descriptionMatch;
  });

  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))", height: "100%"  }} >
     <div><Navbars/></div>

      <Container>
      <Row className="mt-3 mb-3">
        <Col md={7}>
          <h1>RESEARCH LIST</h1>
        </Col>
        <Col md={5} className="d-flex justify-content-end">
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
        <br></br>
        <Row>
          {filteredPDFData.map((pdf, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={4}>
              <Card className="mb-4" style={{ width: '350px', height: '800px' }}>
                <Card.Header>{pdf.title}</Card.Header>
                <Card.Img
                  variant="top"
                  src={`/pdf/${pdf.picture}`}
                  alt="Research Image"
                  style={{ width: '100%', height: '60%' }}
                />
                <Card.Body>
                  <Card.Text>{pdf.description}</Card.Text>
                </Card.Body>
                <div className="card-icons">
                  <Link to={`/pdf/${pdf._id}`}>
                    <div>
                     <MdOutlineSearch className="icon-large "/>
                     </div> 
                     </Link>
                  <MdOutlineEdit
                    className="icon-large"
                    onClick={() => handleEditClick(pdf)}
                  />
                  <MdOutlineDelete
                    className="red-icon icon-large"
                    onClick={() => handleDeleteClick(pdf._id)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-end ml-auto">
  <Link to="/uploadPDF">
    <Button variant="primary"><MdOutlineAdd/></Button>
  </Link>
</div>

      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this PDF?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editedPdf.title}
                onChange={(e) => setEditedPdf({ ...editedPdf, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedPdf.description}
                onChange={(e) => setEditedPdf({ ...editedPdf, description: e.target.value })}
              />
            </Form.Group>

            {/* Add PDF and picture file inputs */}
            <Form.Group controlId="formPdfFile">
              <Form.Label>PDF File </Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handlePdfFileUpload}
              />
            </Form.Group>
            <Form.Group controlId="formPictureFile">
              <Form.Label>Picture File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handlePictureFileUpload}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have successfully updated the PDF.</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ResearchList;
