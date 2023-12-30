import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';

const PDFViewer = () => {
  const [pdfData, setPdfData] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/pdf-upload/${id}`)
      .then((response) => {
        setPdfData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
   
      
     
      
        <div >
            <iframe
              src={`/pdf/${pdfData.pdfFileName}`}
              width='100%'
              height='651'
              scrolling='no'
            ></iframe>
        </div>
   
   
  );
};

export default PDFViewer;

