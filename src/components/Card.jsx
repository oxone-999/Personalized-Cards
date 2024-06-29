import React, { useState, useRef } from "react";
import { Card, Image, Form, Button } from "react-bootstrap";
import styled from "@emotion/styled";
import "./cardbg.css";
import Cropper from "./Cropper.tsx";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

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
  const [completedCrop, setCompletedCrop] = useState()
  const blobUrlRef = useRef("");
  const imgRef = useRef(null)
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState(16 / 9)

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

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="form-group mb-3">
          <label>Upload Image</label>
          <input type="file" id="formFile" onChange={handleImageUpload} />
        </div>
        <div className="form-group">
          <label>Paragraph</label>
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
            {!!completedCrop && (
              <>
                <div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      border: "1px solid black",
                      objectFit: "contain",
                      width: completedCrop.width,
                      height: completedCrop.height,
                    }}
                  />
                </div>
                <div>
                  <button onClick={onDownloadCropClick}>Download Crop</button>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    If you get a security error when downloading try opening the
                    Preview in a new tab (icon near top right).
                  </div>
                  <a
                    href="#hidden"
                    ref={hiddenAnchorRef}
                    download
                    style={{
                      position: "absolute",
                      top: "-200vh",
                      visibility: "hidden",
                    }}
                  >
                    Hidden download
                  </a>
                </div>
              </>
            )}
            {/* <img src={backgroundImage} alt="Card background" /> */}
          </div>
          <div className="para">
            <p style={{ fontSize: `${fontSize}px` }}>{paragraphText}</p>
          </div>
        </div>
      </div>
      <Cropper />
    </div>
  );
}

export default Appp;
