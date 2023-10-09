import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import AuthContext from "../context/AuthContext";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color="#8435D4"
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
