import React, { useState } from 'react';
import { Box, Button, Typography, Slider } from '@mui/material';

const InvoiceLogo = ({ onLogoChange }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [scale, setScale] = useState(100); // Scale percentage

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLogo(reader.result);
        onLogoChange({
          dataUrl: reader.result,
          scale: scale
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (_, newValue) => {
    setScale(newValue);
    if (selectedLogo) {
      onLogoChange({
        dataUrl: selectedLogo,
        scale: newValue
      });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Company Logo
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="logo-upload"
          type="file"
          onChange={handleLogoChange}
        />
        <label htmlFor="logo-upload">
          <Button variant="outlined" component="span">
            Upload Logo
          </Button>
        </label>
      </Box>

      {selectedLogo && (
        <>
          <Box sx={{ width: '100%', maxWidth: 300, mb: 2 }}>
            <Typography gutterBottom>
              Logo Size: {scale}%
            </Typography>
            <Slider
              value={scale}
              onChange={handleScaleChange}
              min={10}
              max={100}
              step={5}
              aria-label="Logo size"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Box>
          <Box sx={{ width: '100%', maxWidth: 300 }}>
            <img
              src={selectedLogo}
              alt="Company Logo"
              style={{
                width: `${scale}%`,
                maxWidth: '300px',
                objectFit: 'contain',
                display: 'block',
                marginBottom: '1rem'
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default InvoiceLogo;