import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteApplyList = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteApplyList = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/get-image/${id}`) // Update the endpoint to the correct applylist endpoint
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Apply List Item Deleted Successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Apply List Item</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure that you want to delete this apply list item?</h3>
        <button className='p-4 bg-red-600 text-whote m-8 w-full' onClick={handleDeleteApplyList}>
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteApplyList;
