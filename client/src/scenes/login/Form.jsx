import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import './Form.css'
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:6001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:6001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
  <>
    <div className="divbg">
      <div>
        <TextField
          label="First Name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.firstName}
          name="firstName"
          error={Boolean(touched.firstName) && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
          sx={{ color: "white", marginBottom: "1rem", width: "300px" }}
          InputProps={{ style: { color: 'white' } }}
        />
        &nbsp;&nbsp;&nbsp;
        <TextField
          label="Last Name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.lastName}
          name="lastName"
          error={Boolean(touched.lastName) && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName}
          sx={{ color: "white", marginBottom: "1rem", width: "300px" }}
          InputProps={{ style: { color: 'white' } }}
        />
      </div>
      <br />
      <div>
        <TextField
          label="Location"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.location}
          name="location"
          error={Boolean(touched.location) && Boolean(errors.location)}
          helperText={touched.location && errors.location}
          sx={{ gridColumn: "span 4", marginBottom: "1rem", width: "500px" }}
          InputProps={{ style: { color: 'white' } }}
        />
      </div>
      <div>
        <TextField
          label="Occupation"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.occupation}
          name="occupation"
          error={Boolean(touched.occupation) && Boolean(errors.occupation)}
          helperText={touched.occupation && errors.occupation}
          sx={{ gridColumn: "span 4", marginBottom: "1rem", width: "500px" }}
          InputProps={{ style: { color: 'white' } }} // Set color to white
        />
      </div>
      <div>
        <Box
          gridColumn="span 4"
          border={`1px solid #EAEDEB`}
          borderRadius="5px"
          p="1rem"
          width="500px"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) =>
              setFieldValue("picture", acceptedFiles[0])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                border={`2px dashed #EAEDBE`}
                p="1rem"
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                <input {...getInputProps()} />
                {!values.picture ? (
                  <p>Add Picture Here</p>
                ) : (
                  <FlexBetween>
                    <Typography>{values.picture.name}</Typography>
                    <EditOutlinedIcon />
                  </FlexBetween>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      </div>
      <div>
      <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4", marginBottom: "1rem", width: "300px" }}
          InputProps={{ style: { color: 'white' } }}
            />
            &nbsp;&nbsp;&nbsp;
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4", marginBottom: "1rem", width: "300px" }}
          InputProps={{ style: { color: 'white' } }}
            />
      </div>
      <Button
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: '#beb8ff',
                color: '#f9ff8d5',
                "&:hover": { color: palette.primary.main },
                width:"300px"
              }}
            >
              {isRegister ? "REGISTER" : "REGISTER"}
            </Button>
      <div className="links">
        
        <Typography
  onClick={() => {
    setPageType(isRegister ? "login" : "register");
    resetForm();
  }}
  sx={{
    textDecoration: "underline",
    color: "#EBEEEC",
    "&:hover": {
      cursor: "pointer",
      color: "#EAEDBE",
    },
  }}
>

  {isRegister ? "Already have an account? Login here." : "Don't have an account? Sign Up here."}
</Typography>

      </div>
    </div>
  </>
)}

            {isLogin && (            
            <div className="ring">
      <i style={{ '--clr': '#00ff0a' }}></i>
      <i style={{ '--clr': '#ff0057' }}></i>
      <i style={{ '--clr': '#fffd44' }}></i>
      <div className="login">
  <h2>Login</h2>

        <div className="inputBx">
        <TextField
  type="text"
  label="Email"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.email}
  name="email"

  error={Boolean(touched.email) && Boolean(errors.email)}
  helperText={touched.email && errors.email}
  sx={{
    gridColumn: "span 4",
    "& input": { backgroundColor: "transparent", border: "none" }, 
    "& input::placeholder": { color: "black" }, 
    "& label": { position: "absolute", top: 10, left: 10 }
  }}
  
/>
</div>
        <div className="inputBx">
          <TextField
            label="Password"
            type="password"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            name="password"
            error={Boolean(touched.password) && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            sx={{ gridColumn: "span 4" }}
          />
        </div>
        <div className="inputBx">
          <input type="submit" value="Sign in" />
        </div>
        <div className="links">
       
            
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: "#EBEEEC",
                "&:hover": {
                  cursor: "pointer",
                  color: "#EAEDBE",
                },
              }}
            >
              {isLogin ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
</div>


      </div>
    </div>
            )};
          </Box>
        

         
        </form>
      )}
    </Formik>
  );
};

export default Form;
