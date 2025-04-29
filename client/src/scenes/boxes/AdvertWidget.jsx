import React, { useState, useEffect } from 'react';
import { Typography, useTheme, Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [imageIndex, setImageIndex] = useState(0);
  const images = [
    'https://i.postimg.cc/1XvgkRQF/Screenshot-2024-02-25-110741.png',
    'https://i.postimg.cc/KcfSb1Hd/aa.jpg',
 
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
   
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(intervalId);
  }, []); 
  return (
    <WidgetWrapper>
      <Box
        border={`1px solid ${palette.primary.main}`} 
        borderRadius="20px" 
        padding="1rem" 
        marginBottom="1rem"       >
        <FlexBetween>
          <Typography color={dark} variant="h5" fontWeight="500">
            
          </Typography>
          <Typography color={medium}></Typography>
        </FlexBetween>
        <img
          width="100%"
          height="auto"
          alt="advert"
          src={images[imageIndex]} 
          style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
        />
        <FlexBetween>
          <Typography color={main}></Typography>
          <Typography color={medium}></Typography>
        </FlexBetween>
        <Typography color={medium} m="0.5rem 0">
          
        </Typography>
      </Box>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
