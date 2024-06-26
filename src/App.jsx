import React, { useState } from "react";
import axios from "axios";
import UTSLogo from "./UTS_Logo.png";

const App = () => {
  const [response, setResponse] = useState("Hi, welcome to UTS-calendar Website. How can I help you?");
  const [value, setValue] = useState("");

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/chatbot", {
        question: value,
      });
      setResponse(response.data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while processing your request.");
    }
  };

  const handleRedirect = () => {
    window.open('https://www.uts.edu.my/#', '_blank'); // Replace with your desired URL
  };

  return (
    <>
      <div className="top">
        <img src={UTSLogo} width="100" alt="UTS Logo" />
      </div>
      
      {/* Background with styled div */}
      <div className="background" style={{ backgroundImage: `url("https://github-production-user-asset-6210df.s3.amazonaws.com/162389957/315539928-32a08f60-4546-4b49-9c13-9f76561a90fa.jpg")` }}>
        <p>UTS-Calendar AI Bot: {response}</p>
        <div className="user_question">
          <p>User:</p>
          <p>{value}</p>
        </div>
      </div>
      <div className="text_box">
        <input
          placeholder="Please type something..."
          type="text"
          value={value}
          onChange={onChange}
        />
        <div id="submit" onClick={handleSubmit}>
          ➢
        </div>
      </div>
      <button className="redirect-button" onClick={handleRedirect}>
        Click to Visit UTS
      </button>
    </>
  );
};

export default App;
