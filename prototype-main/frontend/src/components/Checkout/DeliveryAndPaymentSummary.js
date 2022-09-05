import { AppContext } from "../../Context/AppContext";
import Axios from "axios";
import {
  Box,
  Button,
  Divider,
  Typography,
  Stack,
  StepContent,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import SummaryLine from "./SummaryLine";
import axios from "axios";

const DeliveryAndPaymentSummary = ({ costOfProduct, costOfDeposit }) => {
  const { user, products, premiumUser } = useContext(AppContext);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const config = { headers: { authorization: `Bearer ${user}` } };

  useEffect(() => {
    Axios.get(`http://localhost:8080/user/profile`, config)
      .then((result) => {
        setFullName(result.data?.firstname + " " + result.data.lastname);
        setAddress(result.data.address);
        if (result.data.postcode) {
          setCity(result.data.postcode + ", " + result.data.city);
        } else {
          setCity(result.data.city);
        }
        setCountry(result.data.country);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePay = () => {
    axios
      .post(
        `http://localhost:8080/stripe/create-checkout-session`,
        {
          products,
        },
        config
      )
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  const steps = [
    {
      label: "Billing Address",
      description: "",
    },
    {
      label: "Monthly Payment",
      description: "",
    },
    {
      label: "Initial Payment",
      description: `The first payment includes the monthly fee and the deposit. The deposit equals one monthly payment and is returned after the rental has been finished and the components have been returned.`,
    },
    {
      label: "Finalize",
      description: `Overview and Payment`,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: 550 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="h6">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paddingBottom={5}>
                {step.description}
              </Typography>
              <Box>
                <Box
                  display={index === 0 || index === steps.length - 1 ? "block" : "none"}
                  paddingBottom={5}
                >
                  <Typography>{fullName}</Typography>
                  <Typography>{address}</Typography>
                  <Typography>{city}</Typography>
                  <Typography>{country}</Typography>
                </Box>

                <Stack
                  display={index === 1 || index === steps.length - 1 ? "block" : "none"}
                  spacing={1}
                >
                  <SummaryLine
                    lineTitle={"Subtotal monthly"}
                    lineValue={(costOfProduct / 1.19).toFixed(2) + " €"}
                  />
                  <SummaryLine
                    lineTitle={"VAT (19%)"}
                    lineValue={(costOfProduct - costOfProduct / 1.19).toFixed(2) + " €"}
                  />
                  <Divider />
                  <SummaryLine lineTitle={"First rent payment"} lineValue={costOfProduct + " €"} />
                </Stack>

                <Stack
                  display={index === 2 || index === steps.length - 1 ? "block" : "none"}
                  spacing={1}
                >
                  <Stack display={index === 2 ? "block" : "none"} spacing={1}>
                    <SummaryLine
                      lineTitle={"Subtotal monthly"}
                      lineValue={(costOfProduct / 1.19).toFixed(2) + " €"}
                    />
                    <SummaryLine
                      lineTitle={"VAT (19%)"}
                      lineValue={(costOfProduct - costOfProduct / 1.19).toFixed(2) + " €"}
                    />
                    <Divider />
                    <SummaryLine
                      lineTitle={"First rent payment"}
                      lineValue={costOfProduct + " €"}
                    />
                  </Stack>
                  <SummaryLine lineTitle={"One time deposit"} lineValue={costOfDeposit + " €"} />
                  {!premiumUser ? (
                    <SummaryLine lineTitle={"Shipping Cost"} lineValue={"4 €"} />
                  ) : (
                    ""
                  )}

                  <Divider />
                  <SummaryLine
                    lineTitle={"Total initial payment"}
                    lineValue={costOfProduct + costOfDeposit + (!premiumUser ? 4 : 0) + " €"}
                  />
                </Stack>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={index === steps.length - 1 ? handlePay : handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {index === steps.length - 1 ? "Pay now" : "Continue"}
                </Button>
                <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default DeliveryAndPaymentSummary;
