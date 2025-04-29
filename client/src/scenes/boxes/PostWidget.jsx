import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  CloseOutlined,
  SendOutlined 
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Friend from "components/Friend";
import FlexBetween from "components/FlexBetween";
import { motion } from "framer-motion";
import { green } from "@mui/material/colors";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments: initialComments,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(isLiked);
  const [commentInput, setCommentInput] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [totalComments, setTotalComments] = useState(comments.length);

  const patchLike = async () => {
    const response = await fetch(`http://localhost:6001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsLikedByCurrentUser(!isLikedByCurrentUser);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Comment submitted:", commentInput);
    
    setComments([...comments, commentInput]);
    setTotalComments(totalComments + 1);
   
    setCommentInput("");
  
    setIsCommenting(false);
  };

  const handleCloseCommentBox = () => {
    setIsCommenting(false);
  };

  return (
    <Box m="2rem 0" style={{ maxHeight: "500px", overflowY: "auto" }}> {}
      <Box>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        <Typography color="text.primary" sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      </Box>
      {picturePath && (
        <Box mt="0.75rem">
          <img
            src={`http://localhost:6001/assets/${picturePath}`}
            alt="post"
            style={{
              borderRadius: "0.5rem",
              maxWidth: "100%",
            }}
          />
        </Box>
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              <motion.div
                animate={{ scale: isLikedByCurrentUser ? 1.5 : 1 }} 
                transition={{ duration: 0.2 }}
              >
                {isLikedByCurrentUser ? (
                  <FavoriteOutlined color="primary" />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </motion.div>
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommenting(!isCommenting)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{totalComments}</Typography> 
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {(isCommenting || comments.length > 0) && (
        <Box mt="0.8rem">
          <FlexBetween>
            <form onSubmit={handleCommentSubmit} style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Type your expression..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{
                  borderRadius: "1rem",
                  padding: "0.5rem",
                  width: "400%", 
                  marginRight: "10px", 
                  backgroundColor: "white", 
                }}
              />

              <IconButton type="submit" onClick={handleCommentSubmit}>
                <SendOutlined /> {}
              </IconButton>
            </form>
           
            <IconButton onClick={handleCloseCommentBox}>
              <CloseOutlined />
            </IconButton>
          </FlexBetween>
          
          {comments.length > 0 && (
            <Box mt="0.5rem" style={{ background: "black", padding: "1rem", borderRadius: "0.5rem" }}>
              <div className="comment-container">
                {comments.map((comment, i) => (
                  <Box key={i}>
                    <Divider />
                    <Typography sx={{ m: "0.5rem 0", pl: "1rem", color: "white" }}>
                      {comment}
                    </Typography>
                  </Box>
                ))}
                <Divider />
              </div>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostWidget;
