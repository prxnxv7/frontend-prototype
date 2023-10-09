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
  money_owed: yup.string().required("required"),
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
    const newValue = parseFloat(value);

    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      if (!isNaN(value)) {
        if (
          name === "money_owed" &&
          values.dues !== "" &&
          values.amount_per_due !== ""
        ) {
          // Clear the other two fields if "money_owed" is modified
          setValues({ ...values, dues: "", amount_per_due: "" });
        } else if (
          name === "dues" &&
          values.money_owed !== "" &&
          values.amount_per_due !== ""
        ) {
          // Clear the other two fields if "dues" is modified
          setValues({ ...values, money_owed: "", amount_per_due: "" });
        } else if (
          name === "amount_per_due" &&
          values.money_owed !== "" &&
          values.dues !== ""
        ) {
          // Clear the other two fields if "amount_per_due" is modified
          setValues({ ...values, money_owed: "", dues: "" });
        } else {
          if (name === "amount_per_due" && values.dues !== "") {
            // Auto-calculate money_owed
            const money_owed = value * parseFloat(values.dues);
            setValues({
              ...values,
              money_owed: isNaN(money_owed) ? "" : money_owed.toFixed(2), // Round to 2 decimal places
            });
          } else if (name === "dues" && values.amount_per_due !== "") {
            // Auto-calculate money_owed
            const money_owed = value * parseFloat(values.amount_per_due);
            setValues({
              ...values,
              money_owed: isNaN(money_owed) ? "" : money_owed.toFixed(2), // Round to 2 decimal places
            });
          } else if (name === "dues" && values.money_owed !== "") {
            // Auto-calculate amount_per_due
            const amount_per_due = values.money_owed / value;
            setValues({
              ...values,
              amount_per_due: isNaN(amount_per_due)
                ? ""
                : amount_per_due.toFixed(2), // Round to 2 decimal places
            });
          } else if (name === "money_owed" && values.dues !== "") {
            // Auto-calculate amount_per_due
            const amount_per_due = value / values.dues;
            setValues({
              ...values,
              amount_per_due: isNaN(amount_per_due)
                ? ""
                : amount_per_due.toFixed(2), // Round to 2 decimal places
            });
          } else if (name === "amount_per_due" && values.money_owed !== "") {
            // Auto-calculate dues
            const dues = values.money_owed / value;
            setValues({
              ...values,
              dues: isNaN(dues) ? "" : dues.toFixed(2), // Round to 2 decimal places
            });
          } else if (name === "money_owed" && values.amount_per_due !== "") {
            // Auto-calculate dues
            const dues = value / values.amount_per_due;
            setValues({
              ...values,
              dues: isNaN(dues) ? "" : dues.toFixed(2), // Round to 2 decimal places
            });
          }
        }
      } else {
        // If the input is not a valid number, clear the other fields
        setValues({
          ...values,
          [name]: "",
        });
      }
    }, 1000);
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
        `https://backend-prototype.azurewebsites.net/api/persons/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      setSubmitting(false);
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
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleInputChange(e, values, setValues);
                }}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Amount per Due"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleInputChange(e, values, setValues);
                }}
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
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleInputChange(e, values, setValues);
                }}
                value={values.dues}
                name="dues"
                error={!!touched.dues && !!errors.dues}
                helperText={touched.dues && errors.dues}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{ color: colors.primary[0], backgroundColor: "#a654f8" }}
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
