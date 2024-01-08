import React, { useState } from "react";
import "./Footer.scss";

interface FooterProps {
  onZoomChange: (zoomLevel: number) => void;
}

const Footer: React.FC<FooterProps> = ({ onZoomChange }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoomLevel = parseInt(event.target.value, 10);
    setZoomLevel(newZoomLevel);
    onZoomChange(newZoomLevel);
  };

  return (
    <div className="footer">
      <input
        type="range"
        className="zoom-slider"
        min="25"
        max="200"
        value={zoomLevel}
        onChange={handleZoomChange}
      />
      <div className="zoom-percentage">{zoomLevel}%</div>
    </div>
  );
};

export default Footer;
