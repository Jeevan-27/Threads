import React, { useState, useEffect } from 'react';
import { Typography, useTheme, Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

const Advert = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const [imageIndex, setImageIndex] = useState(0);
  const images = [
    'https://i.postimg.cc/htfC3fB9/Screenshot-2024-02-25-111059.png',
    'https://pictures.brafton.com/x_0_0_0_14119699_800.jpg',
    // Add more image URLs here as needed
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment imageIndex to cycle through images
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Run effect only once on component mount

  return (
    <WidgetWrapper>
      <Box
        border={`1px solid ${palette.primary.main}`} // Add border with primary color
        borderRadius="20px" // Apply arc shape with higher border-radius value
        padding="1rem" // Add padding
        marginBottom="1rem" // Add margin bottom
      >
        <FlexBetween>
          <Typography color={dark} variant="h5" fontWeight="500">
            
          </Typography>
          <Typography color={medium}></Typography>
        </FlexBetween>
        <img
          width="100%"
          height="auto"
          alt="advert"
          src={images[imageIndex]} // Use current image URL based on imageIndex
          style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
        />
        <FlexBetween>
          <Typography color={dark}></Typography>
          <Typography color={medium}></Typography>
        </FlexBetween>
        <Typography color={medium} mt="0.5rem">
         
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default Advert;
