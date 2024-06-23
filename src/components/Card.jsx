import React, { useState } from "react";
import { Card, Image, Form, Button } from "react-bootstrap";
import styled from "@emotion/styled";
import "./cardbg.css";

const StyledCardImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 200px; /* Adjust height as needed */
`;

const StyledParagraph = styled.p`
  padding: 1rem;
`;

function Appp() {
  const [backgroundImage, setBackgroundImage] = useState("./images/def.jpg");
  const [paragraphText, setParagraphText] = useState("");
  const [fontSize, setFontSize] = useState(20);

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setBackgroundImage(e.target.result);
    reader.readAsDataURL(imageFile);
  };

  const handleParagraphChange = (event) => {
    setParagraphText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (optional)
    console.log("Image:", backgroundImage);
    console.log("Paragraph:", paragraphText);
  };

  const handleFontSizeChange = (event) => {
    const newFontSize = parseInt(event.target.value); // Convert string value to integer
    setFontSize(newFontSize);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="form-group mb-3">
          <label for="formFile">Upload Image</label>
          <input type="file" id="formFile" onChange={handleImageUpload} />
        </div>
        <div className="form-group">
          <label for="formText">Paragraph</label>
          <textarea
            id="formText"
            rows={3}
            value={paragraphText}
            onChange={handleParagraphChange}
          />
        </div>
        <div className="PB-range-slider-div">
          <input
            type="range"
            min="1"
            max="72"
            defaultValue="20"
            className="PB-range-slider"
            id="myRange"
            onChange={handleFontSizeChange}
          />
          <p className="PB-range-slidervalue">{fontSize}px</p>
        </div>
      </div>
      <div className="card_main">
        <div className="cardbg">
          <img src="./images/Card BG.png" />
          <div className="image">
            <img src={backgroundImage} alt="Card background" />
          </div>
          <div className="para">
            <p style={{ fontSize: `${fontSize}px` }}>{paragraphText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appp;
