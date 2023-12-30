import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

function ImageUpload() {
  const [allImage, setAllImage] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    getImage();
  }, []);

  useEffect(() => {
    // Filter data whenever the searchTerm changes
    filterData();
  }, [searchTerm, allImage]);

  const getImage = async () => {
    const result = await axios.get("http://localhost:5555/get-image");
    setAllImage(result.data.data);
  };

  const filterData = () => {
    const filtered = allImage.filter((data) => {
      const searchValue = searchTerm.toLowerCase().trim(); // Trim and convert to lowercase
  
      // Define the fields you want to search in
      const fieldsToSearch = [
        data.username.toLowerCase(),
        data.firstName.toLowerCase(),
        data.surname.toLowerCase(),
        data.icNo.toString().toLowerCase(),
        data.gender.toLowerCase(),
        data.mobileNo.toString().toLowerCase(),
        data.hospitalName.toLowerCase(),
        data.department.toLowerCase(),
        data.position.toLowerCase(),
        data.mmcRegistrationNo.toLowerCase(),
      ];
  
      // Check if any field exactly matches the searchValue
      return fieldsToSearch.some((field) => field.includes(searchValue));
    });
    setFilteredData(filtered);
  };

  return (
    <div className="card">
      <div className="card-body">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            {filteredData.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data.username}</td>
                <td>{data.firstName}</td>
                <td>{data.surname}</td>
                <td>{data.icNo}</td>
                <td>{data.gender}</td>
                <td>{data.mobileNo}</td>
                <td>{data.hospitalName}</td>
                <td>{data.department}</td>
                <td>{data.position}</td>
                <td>{data.mmcRegistrationNo}</td>
                <td className=' text-center'>
                  <Link key={`${data._id}`} to={`/get-image/details/${data._id}`}>
                    <BsInfoCircle className=' blue-icon icon-large' />
                  </Link>
                  <Link key={`${data._id}`} to={`/get-image/delete/${data._id}`}>
                    <MdOutlineDelete className=' red-icon icon-large' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ImageUpload;
