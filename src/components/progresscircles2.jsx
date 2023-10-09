import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import React, { useState, useEffect } from "react";

const ProgressCircle2 = ({ progress, text, size = "185" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  let circleBackground = ""; // Define a variable for circle background

  if (text === "null") {
    circleBackground = `
      radial-gradient(${colors.primary[400]} 55%, transparent 56%),
      conic-gradient(transparent 0deg ${angle}deg, ${colors.primary[100]} ${angle}deg 360deg),
      ${colors.greenAccent[500]}
    `;
  } else {
    circleBackground = `
      radial-gradient(${colors.primary[400]} 55%, transparent 56%),
      conic-gradient(transparent 0deg ${angle}deg, ${colors.redAccent[500]} ${angle}deg 360deg),
      ${colors.greenAccent[500]}
    `;
  }
  const circleStyles = {
    background: circleBackground,
    borderRadius: "50%",
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
        variant="h1"
        fontWeight="600"
        color={colors.grey[100]}
        sx={textStyles}
      >
        {formattedProgress}
      </Typography>
    </Box>
  );
};

export default ProgressCircle2;
