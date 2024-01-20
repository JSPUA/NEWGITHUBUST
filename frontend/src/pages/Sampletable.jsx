import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle, BsSearch } from "react-icons/bs";
import { MdOutlineDelete, MdOutlineAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Button,
} from "react-bootstrap";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

const TableWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5555/api/userRegistration/"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredData = data
    ? data.filter(
        (item) =>
          item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.icNo.toString().includes(searchTerm) ||
          item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.mobileNo.toString().includes(searchTerm) ||
          item.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.mmcRegistrationNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // Implement your delete logic here
    setLoading(true);
    axios
      .delete(`http://localhost:5555/get-image/${itemToDelete._id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Item Deleted Successfully", { variant: "success" });
        window.location.reload();
        setShowDeleteModal(false); // Close the delete confirmation modal
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
        setShowDeleteModal(false); // Close the delete confirmation modal
      });
  };

  const handleDeleteCancel = () => {
    // Close the modal and clear the item to delete
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <Container>
      <Row className="mt-3 mb-3">
        <Col md={7}>
          <h2>USER APPLICATION APPROVAL</h2>
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
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>IC No</th>
                <th>Gender</th>
                <th>Mobile No</th>
                <th>Hospital Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>MMC Registration No</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.firstName}</td>
                  <td>{item.surname}</td>
                  <td>{item.icNo}</td>
                  <td>{item.gender}</td>
                  <td>{item.mobileNo}</td>
                  <td>{item.hospitalName}</td>
                  <td>{item.department}</td>
                  <td>{item.position}</td>
                  <td>{item.mmcRegistrationNo}</td>
                  <td className="text-center">
                    <Link key={item._id} to={`/get-image/details/${item._id}`}>
                      <Button variant="primary" className="transparent-button">
                        <BsInfoCircle className="blue-icon icon-large" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="transparent-button"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <MdOutlineDelete className="red-icon icon-large" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemToDelete && (
            <p>Are you sure you want to delete {itemToDelete.username}?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-end ml-auto">
        <Link to="/upload">
          <Button variant="primary">
            <MdOutlineAdd />
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default TableWithSearch;
