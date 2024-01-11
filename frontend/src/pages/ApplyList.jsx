import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import {AiOutlineEdit} from 'react-icons/ai'
import {BsInfoCircle} from 'react-icons/bs'
import {MdOutlineAddBox,MdOutlineDelete} from 'react-icons/md'
import {Link} from 'react-router-dom'
function ImageUpload() {
  const [allImage, setAllImage] = useState([]); // Initialize allImage as an empty array

  useEffect(() => {
    getImage();
  }, []);

  const getImage = async () => {
    const result = await axios.get("http://localhost:5555/get-image");
    setAllImage(result.data.data);
  };

  return (
    <div className="card">
      <div className="card-body">
      <input
          type="text"
          placeholder="Search..."
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
                <th>No</th>
              {/* <th>Image</th>
              <th>Image Second</th> */}
              <th>Username</th>
              <th>First Name</th>
              <th>Surname</th>
              {/* <th>Date of Birth</th> */}
              <th>IC No</th>
              <th>Gender</th>
              {/* <th>Address</th> */}
              <th>Mobile No</th>
              {/* <th>Email</th> */}
              <th>Hospital Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>MMC Registration No</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {allImage.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {/* <td>
                  <img
                    src={`/images/${data.image}`}
                    alt={`Image ${index}`}
                    width={100}
                    height={100}
                  />
                </td>
                <td>
                  <img
                    src={`/images/${data.imageSecond}`}
                    alt={`Image Second ${index}`}
                    width={100}
                    height={100}
                  />
                </td> */}
                <td>{data.username}</td>
                <td>{data.firstName}</td>
                <td>{data.surname}</td>
                {/* <td>{data.dob}</td> */}
                <td>{data.icNo}</td>
                <td>{data.gender}</td>
                {/* <td>{data.address}</td> */}
                <td>{data.mobileNo}</td>
                {/* <td>{data.email}</td> */}
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
