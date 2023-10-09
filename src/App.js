import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, useMode, tokens } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Contacts from "./scenes/profile";
import PersonProfile from "./scenes/contacts";
import Form from "./scenes/addcontact";
import Dashboard from "./scenes/dashboard";
import TransactionsToday from "./scenes/notifications";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const theme1 = useTheme();
  const colors = tokens(theme1.palette.mode);
  const mainBackgroundColor =
    theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[50];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main
            className="content"
            style={{ backgroundColor: mainBackgroundColor }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <AuthProvider>
              <Header />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/notifications" element={<TransactionsToday />} />
                <Route path="/profile/:personId" element={<PersonProfile />} />
                <Route path="/add_contact" element={<Form />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </AuthProvider>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
