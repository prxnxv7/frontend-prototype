import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/header";
import ProgressCircle3 from "../../components/progresscircles3";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [overdues, setOverdues] = useState([]);
  const [transactionnum, setTransactionnum] = useState([]);
  const [total, setTotal] = useState([]);
  const [today, setToday] = useState([]);
  const [pending, setPending] = useState([]);

  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, []);

  let getData = async () => {
    let response = await fetch(
      // "https://backend-prototype.azurewebsites.net/api/dashboard/",
      "http://localhost:8000/api/dashboard/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();

    if (response.status === 200) {
      setOverdues(data.overdue_count);
      setTransactionnum(data.transaction_count);
      setTotal(data.total_payment_amount_today);
      setToday(data.payments_today);
      setPending(data.pending_data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const transactionsDoneForToday = today.length;
  const transactionsPendingForToday = pending.length;
  const totalTransactionsToday =
    transactionsDoneForToday + transactionsPendingForToday;
  console.log("today", transactionsDoneForToday);
  console.log("pending", transactionsPendingForToday);
  console.log("total", totalTransactionsToday);
  // const totalTransactionsToday = transactionnum;

  // Calculate the progress ratio
  // const progressRatio = totalTransactionsToday > 0 ? transactionsDoneForToday / totalTransactionsToday : 0;
  const progressRatio =
    transactionnum > 0 ? transactionsDoneForToday / totalTransactionsToday : 0;
  console.log("Progress", progressRatio);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Today's Summary" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        backgroundColor={colors.primary[0]}
        borderRadius="15px"
        height="70vh"
      >
        <Box
          display="grid"
          gridTemplateColumns="repeat(9, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            flexDirection="column"
            borderRadius="10px"
            margin="15px 0px 0px 15px"
          >
            <Typography
              color={colors.grey[100]}
              variant="h3"
              fontWeight="600"
              margin="22px 0 25px 30px"
              fontFamily="Montserrat"
            >
              Progress
            </Typography>
            <ProgressCircle3
              progress={progressRatio * 100}
              text={`${Math.round(progressRatio * 100)}%`}
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="block"
            borderRadius="10px"
            margin="15px 0px 0px 15px"
          >
            <Typography
              color={colors.grey[100]}
              variant="h3"
              fontWeight="600"
              marginLeft="30px"
              marginTop="22px"
              fontFamily="Montserrat"
            >
              Remaining Transactions
            </Typography>
            <Typography
              color="#FF05C8"
              variant="h2"
              fontWeight="600"
              sx={{
                marginLeft: "30px",
                marginTop: "15px",
              }}
            >
              {transactionnum}
            </Typography>
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="block"
            borderRadius="10px"
            margin="15px 15px 0px 15px"
          >
            <Typography
              marginLeft="30px"
              marginTop="22px"
              color={colors.grey[100]}
              variant="h3"
              fontWeight="600"
              fontFamily="Montserrat"
            >
              Over dues
            </Typography>
            <Typography
              color="#E7D000"
              variant="h2"
              fontWeight="600"
              sx={{
                marginLeft: "30px",
                marginTop: "15px",
              }}
            >
              {overdues}
            </Typography>
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
            borderRadius="10px"
            margin="15px 15px 15px 15px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.grey[700]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h3"
                fontWeight="600"
                fontFamily="Montserrat"
              >
                Paid
              </Typography>
            </Box>
            {today.map((now) => (
              <Box
                key={now.transaction_details.person_details.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.grey[900]}`}
                p="15px"
              >
                <Box color={colors.grey[100]}>
                  <Typography variant="h4" fontWeight="400">
                    {now.transaction_details.person_details.name}
                  </Typography>
                </Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  <Typography variant="h5" fontWeight="400">
                    ₹{now.paid_amount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
            borderRadius="10px"
            margin="15px 15px 15px 15px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.grey[700]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h3"
                fontWeight="600"
                fontFamily="Montserrat"
              >
                Pending
              </Typography>
            </Box>
            {pending.map((left) => (
              <Box
                key={left.person_details.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.grey[900]}`}
                p="15px"
              >
                <Box color={colors.grey[100]}>
                  <Typography variant="h4" fontWeight="400">
                    {left.person_details.name}
                  </Typography>
                </Box>
                <Box p="5px 10px" borderRadius="4px">
                  <Typography variant="h5" fontWeight="400">
                    ₹{left.pending_amount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            gridColumn="span 3"
            gridRow="span 1"
            backgroundColor={colors.primary[400]}
            borderRadius="10px"
            margin="15px 0px 15px 15px"
          >
            <Box
              mt="20px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  color={colors.grey[100]}
                  fontFamily="Montserrat"
                >
                  Total Collection
                </Typography>
                <Typography
                  mt="5px"
                  variant="h2"
                  fontWeight="bold"
                  color={colors.blueAccent[400]}
                >
                  ₹{total}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
