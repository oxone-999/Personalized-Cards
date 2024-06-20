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
  const [backgroundImage, setBackgroundImage] = useState("");
  const [paragraphText, setParagraphText] = useState("");

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

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          <Form.Group controlId="formText">
            <Form.Label>Paragraph</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={paragraphText}
              onChange={handleParagraphChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
      <div className="card_main">
        <div className="cardbg">
            <img src="./images/Card BG.png" />
        </div>
        <div className="image">
            <img src={backgroundImage} alt="Card background" />
        </div>
        <div className="para">
            <p>{paragraphText}</p>
        </div>
      </div>
    </Card>
  );
}

export default Appp;
