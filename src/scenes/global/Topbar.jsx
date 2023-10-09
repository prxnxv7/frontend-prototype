import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const mainBackgroundColor =
    theme.palette.mode === "dark" ? colors.primary[0] : colors.primary[0];

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor={mainBackgroundColor}
    >
      <Box>
        <Typography variant="h1" color="#8435D4" fontFamily="Inder">
          Welcome Boss,
        </Typography>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton
          onClick={colorMode.toggleColorMode}
          color={colors.blueAccent[300]}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <Link to='/notifications'>
          <IconButton sx={{mt:"5px"}}>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Link>
        <Link to='/add_contact'>
          <IconButton sx={{mt:"5px"}}>
            <PersonAddAltIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Topbar;
