import React, { useState, useEffect } from "react";
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import "./w.css"; 
import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:6001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
    
  };

  useEffect(() => {
    getUser();
  }, []); 
  const handleEdit = () => {
    setEditing(true);
    setEditedUser(user);
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch(`http://localhost:6001/save/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedUser),
    });
    const data = await response.json();
    setUser(data);
    setEditing(false);
  };

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = editing ? editedUser : user;

  return (
    <WidgetWrapper className="user-widget arc-shape" onClick={() => navigate(`/profile/${userId}`)}>
      <UserImage image={picturePath} />
      <Box>
        <Typography variant="h4" color={dark} fontWeight="500">
          {firstName} {lastName}
        </Typography>
        <Typography color={medium}>{friends.length} friends</Typography>
      </Box>

      <Box className="info-container">
        <Box className="info-item">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          {editing ? (
            <TextField
              name="location"
              value={editedUser.location}
              onChange={handleChange}
              fullWidth
            />
          ) : (
            <Typography color={medium}>{location}</Typography>
          )}
        </Box>
        <Box className="info-item">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          {editing ? (
            <TextField
              name="occupation"
              value={editedUser.occupation}
              onChange={handleChange}
              fullWidth
            />
          ) : (
            <Typography color={medium}>{occupation}</Typography>
          )}
        </Box>
      </Box>

      <Box className="stats-container">
        <Box className="stat">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </Box>
        <Box className="stat">
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </Box>
      </Box>

      {editing ? (
        <Button onClick={handleSubmit}>Save</Button>
      ) : (
        <Button startIcon={<EditOutlined />} onClick={handleEdit}>
          Edit
        </Button>
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
