import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import "./index.css";
import AuthContext from "../../context/AuthContext";
import ProgressCircle from "../../components/progresscircles";

const PersonProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { personId } = useParams();
  const [person, setPerson] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getPerson();
  }, [personId]);

  let getPerson = async () => {
    let response = await axios.get(
      `http://127.0.0.1:8000/api/persons/${personId}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    const personData = response.data.person;
    const transactionData = response.data.transactions;
    const paymentData = response.data.payments;

    if (response.status === 200) {
      setPerson(personData);
      setTransactions(transactionData);
      setPayments(paymentData);
      console.log(person);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/delete/${personId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (response.status === 200) {
        // Handle successful deletion, maybe navigate to a different page or show a success message
        navigate("/contacts");
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    } catch (error) {
      // Handle error, maybe show an error message
    }
  };
  return (
    <Box>
      <Box
        margin="5px 20px 0px 20px"
        borderRadius="10px"
        sx={{ backgroundColor: colors.primary[0] }}
      >
        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          gap="10rem"
          padding="0px 20px 0px 30px"
        >
          <h1 sx={{ marginLeft: "10px" }}>{person.name}</h1>
          <h2>{person.phno}</h2>
          <Button
            variant="h1"
            sx={{
              backgroundColor: colors.redAccent[500],
              color: "#ffffff",
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>

        {/* details */}
        <Box backgroundColor={colors.primary[0]}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(9, 1fr)"
            gridAutoRows="140px"
            gap="10px"
          >
            {/* Row 1 */}
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 0px 0px 30px"
              paddingLeft="20px"
            >
              <h2>First Due</h2>
              <h2 className="css">
                {new Date(person.start_date).toLocaleDateString()}
              </h2>
            </Box>
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 0px 0px 30px"
              paddingLeft="20px"
            >
              <h2>Number of Dues</h2>
              <h2 className="css">{parseInt(person.dues)}</h2>
            </Box>
            <Box
              gridColumn="span 2"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 0px 0px 30px"
              paddingLeft="20px"
            >
              <h2>Next Due</h2>
              <h2 className="css">
                {transactions.length > 0
                  ? new Date(transactions[0].next_due_date).toLocaleDateString()
                  : ""}
              </h2>
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 15px 0px 30px"
              paddingLeft="20px"
            >
              <h2>Amount Per Due</h2>
              <h2 className="css">₹ {person.amount_per_due}</h2>
            </Box>

            {/* ROW 2 */}
            {transactions.map((transaction) => (
              <Box
                gridColumn="span 3"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                margin="15px 0px 15px 30px"
              >
                <Box
                  mt="25px"
                  p="0 30px"
                  display="block "
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={colors.grey[100]}
                    mb="15px"
                  >
                    Completion
                  </Typography>
                  <ProgressCircle
                    progress={
                      transaction.final_paid / transaction.total_amount_owed
                    }
                    text="null"
                  />
                </Box>
              </Box>
            ))}
            {transactions.map((transaction) => (
              <Box
                gridColumn="span 3"
                gridRow="span 2"
                backgroundColor={colors.primary[400]}
                borderRadius="10px"
                margin="15px 0px 15px 30px"
              >
                <Box
                  mt="25px"
                  p="0 30px"
                  display="block "
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={colors.grey[100]}
                    mb="15px"
                  >
                    Collections
                  </Typography>
                  <ProgressCircle
                    progress={
                      transaction.final_paid / transaction.total_amount_owed
                    }
                    text={transaction.total_amount_owed}
                  />
                </Box>
              </Box>
            ))}

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
                borderBottom={`4px solid ${colors.primary[400]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography
                  color={colors.grey[100]}
                  variant="h4"
                  fontWeight="600"
                >
                  Previous Payments
                </Typography>
              </Box>
              {payments.map((payment) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.grey[900]}`}
                  p="15px"
                  
                >
                  <Box color={colors.grey[100]} fontSize="medium">
                    {new Date(payment.paid_date).toLocaleDateString()}
                  </Box>
                  <Box p="5px 10px" borderRadius="4px" fontSize="medium">
                    ₹{payment.paid_amount}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Row 3 */}
            {transactions.map((transaction) => (
              <Box
                gridColumn="span 9"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="space-between "
                borderRadius="10px"
                margin="15px 15px 25px 30px"
              >
                <Box display="block">
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                    paddingLeft="10rem"
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color="#00FFF5"
                    paddingLeft="10rem"
                    paddingTop="15px"
                  >
                    ₹{transaction.total_amount_owed}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                  >
                    Collected
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color="#E7D000"
                    paddingTop="15px"
                  >
                    ₹{transaction.final_paid}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                    paddingRight="10rem"
                  >
                    Pending
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color="#FF05C8"
                    paddingRight="10rem"
                    paddingTop="15px"
                  >
                    ₹{transaction.pending_amount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonProfile;
