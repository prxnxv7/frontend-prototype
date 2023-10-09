import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import React, { useState, useEffect } from "react";

const ProgressCircle = ({ progress, text, size = "165" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  let circleBackground = ""; // Define a variable for circle background

  if (text === "null") {
    circleBackground = `
      radial-gradient(${colors.primary[400]} 55%, transparent 56%),
      conic-gradient(transparent 0deg ${angle}deg, #00FFF5 ${angle}deg 360deg),
      #E7D000
    `;
  } else {
    circleBackground = `
      radial-gradient(${colors.primary[400]} 55%, transparent 56%),
      conic-gradient(transparent 0deg ${angle}deg, #FF05C8 ${angle}deg 360deg),
      #E7D000
    `;
  }
  const circleStyles = {
    background: circleBackground,
    borderRadius: "50%",
    marginLeft: "50px",
    width: `${size}px`,
    height: `${size}px`,
    position: "relative",
  };

  const textStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  };

  const [formattedProgress, setformattedProgress] = useState([]);
  useEffect(() => {
    if (text === "null") {
      setformattedProgress((progress * 100).toFixed(2));
    } else {
      setformattedProgress(text);
    }
  });

  return (
    <Box sx={circleStyles}>
      <Typography
        variant="h3"
        fontWeight="600"
        color={colors.grey[100]}
        sx={textStyles}
      >
        {text === "null" ? `${formattedProgress}%` : `₹${formattedProgress}`}
      </Typography>
    </Box>
  );
};

export default ProgressCircle;
