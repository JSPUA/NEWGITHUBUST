import React, { useState } from 'react';
import axios from 'axios';

const SendEmailButton = () => {
  // State to store the recipient's email and the email content
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');

  const handleSendEmail = () => {
    const emailData = {
      email: recipientEmail,
      subject: emailSubject,
      text: emailText
    };

    axios.post('http://localhost:5555/send-email', emailData)
      .then(response => {
        // Handle the response from the server here
        console.log(response.data);
        alert('Email sent successfully!');
        // Optionally reset the form fields
        setRecipientEmail('');
        setEmailSubject('');
        setEmailText('');
      })
      .catch(error => {
        // Handle the error here
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      });
  };

  return (
    <div>
      <input
        type="email"
        value={recipientEmail}
        onChange={e => setRecipientEmail(e.target.value)}
        placeholder="Recipient's email"
      />
      <input
        type="text"
        value={emailSubject}
        onChange={e => setEmailSubject(e.target.value)}
        placeholder="Email Subject"
      />
      <textarea
        value={emailText}
        onChange={e => setEmailText(e.target.value)}
        placeholder="Email Content"
      />
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default SendEmailButton;
