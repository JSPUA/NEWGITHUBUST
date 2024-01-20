import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Navbars from "./Navbar";
import UrobotLogo from "../images/urobot logo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    // Add the user message to the messages array
    const userMessage = { text: input, sender: "You" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // Clear the input field
    setInput("");

    if (showWelcome) {
      // Hide the welcome message after the first user message
      setShowWelcome(false);
    }

    try {
      // Make an API call to your backend with the user's input
      const response = await fetch("http://localhost:5555/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from the server");
      }

      // Parse the JSON response from the server
      const responseData = await response.json();

      // Add the bot's response to the messages array
      const botMessage = {
        text: responseData.candidates[0]?.content?.parts[0]?.text,
        sender: "Urobot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error.message);
      // Handle error, update state, or show a user-friendly error message
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key in a textarea
      handleSendMessage();
    }
  };

  return (
    <div>
      <Navbars />
      <div
        style={{
          padding: "10px",
          margin: "0",
          width: "75%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h3 style={{ margin: "10px 0", padding: "10px", color: "#3b5998" }}>
          Chat With Urobot
        </h3>
        <div
          style={{
            width: "80%",
            margin: "10px auto", // Adjusted margin for smaller space
            border: "1px solid WhiteSmoke",
            borderRadius: "8px",
            borderStyle: "groove",
            borderColor: "WhiteSmoke",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            height: "80vh", // Adjusted height
            fontFamily: "Roboto, sans-serif",
            backgroundColor: "white",
          }}
        >
          {showWelcome && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={UrobotLogo}
                alt="Logo"
                style={{ maxWidth: "400px", marginBottom: "8px" }}
              />
              <h3 style={{ color: "#696969" }}>How can I help you today?</h3>
            </div>
          )}
          <div
            style={{
              flex: "1",
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "8px",
                  padding: "15px",
                  borderRadius:
                    message.sender === "You" ? "5px 25px 5px 25px" : "10px",
                  backgroundColor:
                    message.sender === "You" ? "#ADD8E6" : "transparent",
                  textAlign: "left",
                }}
              >
                <strong>{message.sender}</strong>
                <div>{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ marginTop: "16px", display: "flex" }}>
            <input
              type="text"
              value={input}
              placeholder="Message Urobot..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Handle the Enter key
              style={{
                flex: "1",
                marginRight: "8px",
                padding: "8px",
                border: "",
                borderRadius: "10px",
                borderWidth: "0.5px",
                borderColor: "Gainsboro",
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              style={{
                padding: "8px",
                borderRadius: "10px",
                borderWidth: "1px",
                borderColor: "Gainsboro",
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
