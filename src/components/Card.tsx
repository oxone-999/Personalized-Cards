import React, { useState, useRef } from "react";
import { Card, Image, Form, Button } from "react-bootstrap";
import styled from "@emotion/styled";
import "./cardbg.css";

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
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
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
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

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

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
          <div>
            <label htmlFor="scale-input">Scale: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>
          <div>
            <button onClick={handleToggleAspectClick}>
              Toggle aspect {aspect ? "off" : "on"}
            </button>
          </div>
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
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="form-group mb-3">
          {/* <label>Upload Image</label>
          <input type="file" id="formFile" onChange={handleImageUpload} /> */}
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
                      width: completedCrop.width / 2,
                      height: completedCrop.height / 2,
                    }}
                  />
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
    </div>
  );
}

export default Appp;
