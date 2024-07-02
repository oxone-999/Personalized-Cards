import React, { useState, useRef } from "react";
import { Card, Image, Form, Button } from "react-bootstrap";
import styled from "@emotion/styled";
import "./cardbg.css";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function Appp() {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1 / 1);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
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

  const [backgroundImage, setBackgroundImage] = useState("./images/def.jpg");
  const [paragraphText, setParagraphText] = useState("");
  const [fontSize, setFontSize] = useState(20);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) return; // Handle no file selected case

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setBackgroundImage(e.target.result as string);
      }
    };
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
      <div className="App">
        <div className="Crop-Controls">
          <input type="file" accept="image/*" onChange={onSelectFile} />
          <div></div>
        </div>
        <div className="cropimg">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              // minWidth={400}
              minHeight={100}
              // circularCrop
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="form-group mb-3"></div>
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
          {!!completedCrop && (
            <>
              <div className="image">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: "15rem",
                    height: "15rem",
                  }}
                />
              </div>
            </>
          )}

          <div className="para">
            <p style={{ fontSize: `${fontSize}px` }}>{paragraphText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appp;
