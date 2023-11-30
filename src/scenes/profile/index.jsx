import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [contactData, setContactData] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getprofile();
  }, []);

  const CustomToolbar = () => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <GridToolbar />
        <Link to="/add_contact">
          <Button
            sx={{
              backgroundColor: "#a654f8",
              color: "#ffffff",
              marginLeft: "5px",
              marginTop: "5px",
              paddingTop: "4px",
              paddingBottom: "4px",
              paddingLeft: "5px",
              fontSize: "12px",
              '&:hover': {
                backgroundColor: "#a654f8",
              }
            }}
          >
            <PersonAddAltIcon
              sx={{ paddingRight: "3px", marginRight: "5px" }}
            />
            Add Contact
          </Button>
        </Link>
      </div>
    );
  };

  let getprofile = async () => {
    let response = await fetch(
      // "https://backend-prototype.azurewebsites.net/api/profile/", 
      "http://localhost:8000/api/profile/", 
      {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setContactData(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      cellClassName: "name-column--cell",
    },
    {
      field: "phno",
      headerName: "Phone Number",
      flex: 1.1,
    },
    {
      field: "money_owed",
      headerName: "Total Amount",
      flex: 1,
    },
    {
      field: "time_period_given",
      headerName: "Due Period",
      flex: 1,
    },
    {
      field: "amount_per_due",
      headerName: "Amount per due",
      flex: 1.2,
    },
    {
      field: "dues",
      headerName: "No. of dues ",
      flex: 1,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 1,
      valueGetter: (params) => {
        const startDate = new Date(params.row.start_date);
        return startDate.toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`/profile/${params.row.id}`}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: "#ffffff",
              }}
            >
              More
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="60vh"
        width="75rem"
        sx={{
          "& .MuiDataGrid-root": {
            fontSize: "15px",
            borderColor: colors.grey[900],
            backgroundColor: colors.primary[0],
            borderRadius: "20px",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "15px",
            borderLeft: "none",
            paddingLeft: "20px",
            fontFamily: "sans-serif",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "17px",
            marginLeft: "10px",
            fontFamily: "Montserrat",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[0],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius: "20px",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `#ffffff !important`,
            marginBottom: "20px",
            marginTop: "20px",
            marginLeft: "10px",
            backgroundColor: "#a654f8",
          },
        }}
      >
        <DataGrid
          rows={contactData}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
