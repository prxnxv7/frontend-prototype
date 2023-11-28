import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";
import React, { useContext } from "react";
import axios from "axios";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  phno: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  time_period_given: yup.string().required("required"),
});

const initialValues = {
  name: "",
  phno: "",
  money_owed: "",
  time_period_given: "",
  amount_per_due: "",
  dues: "",
};

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let { authTokens, logoutUser } = useContext(AuthContext);

  let inputTimer;

  const handleInputChange = (e, values, setValues) => {
    const { name, value } = e.target;

    // Parse values to float for calculations
    const moneyOwed = parseFloat(values.money_owed) || 0;
    const dues = parseFloat(values.dues) || 0;
    const amountPerDue = parseFloat(values.amount_per_due) || 0;

    let calculatedValue;

    switch (name) {
      case "money_owed":
        // Calculate amount_per_due when money_owed and dues are filled
        if (dues !== 0 && dues !== null) {
          calculatedValue = moneyOwed / dues;
          setValues({ ...values, amount_per_due: calculatedValue.toFixed(2) });
        }
        break;
      case "dues":
        // Calculate money_owed when dues and amount_per_due are filled
        if (amountPerDue !== 0 && amountPerDue !== null) {
          calculatedValue = dues * amountPerDue;
          setValues({ ...values, money_owed: calculatedValue.toFixed(2) });
        }
        break;
      case "amount_per_due":
        // Calculate dues when money_owed and amount_per_due are filled
        if (moneyOwed !== 0 && moneyOwed !== null && amountPerDue !== 0 && amountPerDue !== null) {
          calculatedValue = moneyOwed / amountPerDue;
          setValues({ ...values, dues: calculatedValue.toFixed(2) });
        }
        break;
      default:
        break;
    }
  };
    

  const handleFormSubmit = async (values, { setSubmitting }) => {
    const formData = {
      name: values.name,
      phno: values.phno,
      money_owed: values.money_owed,
      time_period_given: values.time_period_given,
      amount_per_due: values.amount_per_due,
      dues: values.dues,
    };

    try {
      const response = await axios.post(
        // `https://backend-prototype.azurewebsites.net/api/persons/`,
        `http://127.0.0.1:8000/api/persons/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      setSubmitting(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setValues,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phno}
                name="phno"
                error={!!touched.phno && !!errors.phno}
                helperText={touched.phno && errors.phno}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Total Amount"
                onBlur={(e) => {
                  handleBlur(e);
                  handleInputChange(e, values, setValues);
                }}
                onChange={handleChange}
                value={values.money_owed}
                name="money_owed"
                error={!!touched.money_owed && !!errors.money_owed}
                helperText={touched.money_owed && errors.money_owed}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Amount per Due"
                onBlur={(e) => {
                  handleBlur(e);
                  handleInputChange(e, values, setValues);
                }}
                onChange={handleChange}
                value={values.amount_per_due}
                name="amount_per_due"
                error={!!touched.amount_per_due && !!errors.amount_per_due}
                helperText={touched.amount_per_due && errors.amount_per_due}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dues"
                onBlur={(e) => {
                  handleBlur(e);
                  handleInputChange(e, values, setValues);
                }}
                onChange={handleChange}
                value={values.dues}
                name="dues"
                error={!!touched.dues && !!errors.dues}
                helperText={touched.dues && errors.dues}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Due Period"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.time_period_given}
                name="time_period_given"
                error={
                  !!touched.time_period_given && !!errors.time_period_given
                }
                helperText={
                  touched.time_period_given && errors.time_period_given
                }
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{ color: colors.primary[0], backgroundColor: "#a654f8",     '&:hover': {
                  backgroundColor: "#a654f8",
                },}}
              >
                Create New Contact
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
