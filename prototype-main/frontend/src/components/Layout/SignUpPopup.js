import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";

import axios from "axios";
import React, { useState } from "react";
import "./Popup.css";

function SignUpPopup(props) {
  const [activeStep, setActiveStep] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState(false);
  const [userName, setUserName] = useState("defaultUserName");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyPasswordError, setVerifyPasswordError] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecials, setHasSpecials] = useState(false);
  const [hasLength, setHasLength] = useState(false);

  const steps = [
    {
      label: "Personal Information",
      description: `Welcome to AirParts Customer Area. \n Please fill out the form to sign in:`,
    },
    {
      label: "Billing Address",
      description: "Address to which you will receive the bills and default delivery address",
    },
    {
      label: "Account Verification",
      description: `Enter email and password to register in your account`,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateEmail = (email) => {
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const validateLettersOnly = (email) => {
    const expression = /[a-zA-ZäöüßÄÖÜ]\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const validateNumbersOnly = (email) => {
    const expression = /[0-9]\.?$/i;

    return expression.test(String(email).toLowerCase());
  };

  const handleSignUp = () => {
    if (
      firstName &&
      !firstNameError &&
      lastName &&
      !lastNameError &&
      address &&
      city &&
      !cityError &&
      country &&
      !countryError &&
      email &&
      !emailError &&
      password &&
      hasLowerCase &&
      hasUpperCase &&
      hasNumber &&
      hasSpecials &&
      hasLength &&
      password == verifyPassword
    ) {
      const user = {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        country,
        userName,
        email,
        password,
      };
      axios.post("http://localhost:8080/user/register", user).then((res) => {
        if (res.data.status === "ok") {
          props.setTrigger(false);
          props.setOpenSnackBar(true);
          resetValues();
        } else {
          setEmailError(true);
          props.setOpenSnackBarError(true);
        }
      });
    } else {
      if (!firstName) {
        setFirstNameError(true);
      }
      if (!lastName) {
        setLastNameError(true);
      }
      if (!address) {
        setAddressError(true);
      }
      if (!city) {
        setCityError(true);
      }
      if (!country) {
        setCountryError(true);
      }
      if (!email) {
        setEmailError(true);
      }
      if (!(password && hasLowerCase && hasUpperCase && hasNumber && hasSpecials && hasLength)) {
        setPasswordError(true);
      }

      if (
        !(verifyPassword && hasLowerCase && hasUpperCase && hasNumber && hasSpecials && hasLength)
      ) {
        setVerifyPasswordError(true);
      }

      if (!firstName || !lastName) {
        setActiveStep(0);
      } else {
        if (!address || !city || !country) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      }
    }
  };

  const resetValues = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setCity("");
    setPostalCode("");
    setCountry("");
    setEmail("");
    setPassword("");
    setVerifyPassword("");
  };

  const handleEnter = (event) => {
    if (event.charCode === 13 && activeStep < steps.length - 1) {
      handleNext();
    } else {
      if (event.charCode === 13 && activeStep === steps.length - 1) {
        handleSignUp();
      }
    }
  };

  const handleLogin = () => {
    props.setTrigger(false);
    props.setChange(true);
  };

  const handleFirstName = (value) => {
    if (validateLettersOnly(value)) {
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
    setFirstName(value);
  };

  const handleLastName = (value) => {
    if (validateLettersOnly(value)) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
    setLastName(value);
  };

  const handleCity = (value) => {
    if (validateLettersOnly(value)) {
      setCityError(false);
    } else {
      setCityError(true);
    }
    setCity(value);
  };

  const handlePostalCode = (value) => {
    if (validateNumbersOnly(value) || value === "") {
      setPostalCodeError(false);
    } else {
      setPostalCodeError(true);
    }
    setPostalCode(value);
  };

  const handleCountry = (value) => {
    if (validateLettersOnly(value)) {
      setCountryError(false);
    } else {
      setCountryError(true);
    }
    setCountry(value);
  };

  const handleEmail = (value) => {
    if (validateEmail(value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    setEmail(value);
  };

  const handlePassword = (value) => {
    setPassword(value);
    var lowerCaseLetters = /[a-z]/g;
    if (value.match(lowerCaseLetters)) {
      setHasLowerCase(true);
    } else {
      setHasLowerCase(false);
    }

    var upperCaseLetters = /[A-Z]/g;
    if (value.match(upperCaseLetters)) {
      setHasUpperCase(true);
    } else {
      setHasUpperCase(false);
    }

    var numbers = /[0-9]/g;
    if (value.match(numbers)) {
      setHasNumber(true);
    } else {
      setHasNumber(false);
    }

    var specials = /[!#$%&'*+/=?^_`{|}~?(:)]/g;
    if (value.match(specials)) {
      setHasSpecials(true);
    } else {
      setHasSpecials(false);
    }

    if (value.length >= 8) {
      setHasLength(true);
    } else {
      setHasLength(false);
    }
  };

  return props.trigger ? (
    <Box flex={5} width={400} padding={5}>
      <Box>
        <Stack direction={"column"} spacing={2}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: 400 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box>
                    <Box display={index === 0 ? "block" : "none"}>
                      <Stack direction={"column"} spacing={2}>
                        <TextField
                          id="firstName"
                          label="First Name"
                          variant="filled"
                          value={firstName}
                          required
                          error={firstNameError}
                          onChange={(event) => {
                            if (firstNameError && event.target.value.length > 0) {
                              setFirstNameError(false);
                            }
                            handleFirstName(event.target.value);
                          }}
                          onKeyPress={handleEnter}
                        />
                        <TextField
                          id="lastName"
                          label="Last Name"
                          variant="filled"
                          value={lastName}
                          required
                          error={lastNameError}
                          onChange={(event) => {
                            if (lastNameError && event.target.value.length > 0) {
                              setLastNameError(false);
                            }
                            handleLastName(event.target.value);
                          }}
                          onKeyPress={handleEnter}
                        />
                      </Stack>
                    </Box>

                    <Box display={index === 1 ? "block" : "none"}>
                      <Stack direction={"column"} spacing={2}>
                        <TextField
                          id="address"
                          label="Address"
                          variant="filled"
                          value={address}
                          required
                          error={addressError}
                          onChange={(event) => setAddress(event.target.value)}
                          onKeyPress={handleEnter}
                        />
                        <TextField
                          id="city"
                          label="City"
                          variant="filled"
                          value={city}
                          required
                          error={cityError}
                          onChange={(event) => handleCity(event.target.value)}
                          onKeyPress={handleEnter}
                        />
                        <TextField
                          id="postalCode"
                          label="Postal Code"
                          variant="filled"
                          value={postalCode}
                          error={postalCodeError}
                          onChange={(event) => handlePostalCode(event.target.value)}
                          onKeyPress={handleEnter}
                        />
                        <TextField
                          id="country"
                          label="Country"
                          variant="filled"
                          value={country}
                          required
                          error={countryError}
                          onChange={(event) => handleCountry(event.target.value)}
                          onKeyPress={handleEnter}
                        />
                      </Stack>
                    </Box>

                    <Box display={index === 2 ? "block" : "none"}>
                      <Stack direction={"column"} spacing={2}>
                        <TextField
                          id="email"
                          label={emailError ? "Valid email required!" : "Email"}
                          variant="filled"
                          value={email}
                          required
                          error={emailError}
                          onChange={(event) => handleEmail(event.target.value)}
                          onKeyPress={handleEnter}
                        />
                        <TextField
                          id="password"
                          type={showPassword ? "text" : "password"}
                          label={passwordError ? "Check Password requirements" : "Password"}
                          variant="filled"
                          value={password}
                          required
                          error={passwordError}
                          InputProps={{
                            // <-- This is where the toggle button is added.
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          onFocus={() => setPasswordFocus(true)}
                          // onBlur={() => setPasswordFocus(false)}
                          onChange={(event) => handlePassword(event.target.value)}
                          onKeyPress={handleEnter}
                        />

                        <TextField
                          id="repeatPassword"
                          type={showRepeatPassword ? "text" : "password"} // <-- This is where the magic happens.
                          label={
                            verifyPasswordError
                              ? "Verify Password: Does not equal password above"
                              : "Repeat Password"
                          }
                          variant="filled"
                          value={verifyPassword}
                          required
                          error={verifyPasswordError}
                          InputProps={{
                            // <-- This is where the toggle button is added.
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                  onMouseDown={() => setShowRepeatPassword(!showRepeatPassword)}
                                >
                                  {showRepeatPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          onChange={(event) => {
                            setVerifyPassword(event.target.value);
                            if (event.target.value === password) {
                              setVerifyPasswordError(false);
                            } else {
                              setVerifyPasswordError(true);
                            }
                          }}
                          onKeyPress={handleEnter}
                        />

                        <Box display={passwordFocus ? "block" : "none"}>
                          <Typography className={hasLowerCase ? "valid" : "invalid"}>
                            At least a <b>lowercase</b> letter
                          </Typography>
                          <Typography className={hasUpperCase ? "valid" : "invalid"}>
                            At least a <b>capital (uppercase)</b> letter
                          </Typography>
                          <Typography className={hasNumber ? "valid" : "invalid"}>
                            At least a <b>number</b>
                          </Typography>
                          <Typography className={hasSpecials ? "valid" : "invalid"}>
                            At least a <b>special character</b>. (e.g. !#$%'*+/=?^_`~(:)?)
                          </Typography>
                          <Typography className={hasLength ? "valid" : "invalid"}>
                            Minimum <b>8 characters</b>
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box className="boxButtons">
                        <Button
                          className="clsButton"
                          variant="contained"
                          sx={{ mt: 1, mr: 1 }}
                          onClick={() => props.setTrigger(false)}
                        >
                          Cancel
                        </Button>

                        <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Back
                        </Button>

                        <Button
                          className="signUp"
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSignUp : handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Sign Up" : "Continue"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <Stack
          direction={"column"}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ paddingTop: 5 }}
        >
          <Typography variant="h7">You already have an AirParts user account?</Typography>
          <Button className="login" onClick={handleLogin} sx={{ width: "33%" }}>
            Log in
          </Button>
        </Stack>
      </Box>
    </Box>
  ) : (
    ""
  );
}

export default SignUpPopup;
