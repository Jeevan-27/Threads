import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
      
    <div>
    <center>
    <br/><br/>
    <h1 style={{ fontFamily: "Quicksand, sans-serif", color: '#beb8ff' }}>Threads</h1>


    </center>
        <Form />
        </div>
  );
};

export default LoginPage