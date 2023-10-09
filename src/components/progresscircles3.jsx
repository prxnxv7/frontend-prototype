import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import React from "react";

const ProgressCircle3 = ({ progress, text, size = "165" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  let circleBackground = `
  radial-gradient(${colors.primary[400]} 55%, transparent 56%),
  conic-gradient(transparent 0deg ${angle}deg, #FF05C8 ${angle}deg 360deg),
  #E7D000`; // Define a variable for circle background

  const circleStyles = {
    background: circleBackground,
    borderRadius: "50%",
    // marginLeft: "50px",
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

  return (
    <Box sx={circleStyles}>
      <Typography
        variant="h3"
        fontWeight="600"
        color={colors.grey[100]}
        sx={textStyles}
      >
        {`${text}`}
      </Typography>
    </Box>
  );
};

export default ProgressCircle3;
