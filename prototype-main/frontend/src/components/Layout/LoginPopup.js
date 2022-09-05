import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box, Button, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import "./Popup.css";

function LoginPopup(props) {
  const { setPremiumUser, setProfile } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [notification, setNotification] = useState("Sign in with e-mail and password");

  const handleAnswerChange = (event) => {
    if (event.charCode === 13 && email !== "" && password !== "") {
      handleLogin();
    }
  };

  const isPremium = (userCookie) => {
    let config = { headers: { authorization: `Bearer ${userCookie}` } };
    axios
      .get(`http://localhost:8080/user/profile`, config)
      .then((res) => {
        setProfile(res.data);
        setPremiumUser(res.data.premium);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleLogin = () => {
    axios
      .post("http://localhost:8080/user/login", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          props.setOpenSnackBar(true);
          props.setTrigger(false);
          props.setUser(res.data.user);
          props.setLoginVisibility("none");
          props.setAccountVisibility("block");
          Cookies.set("user", res.data.user, { expires: 1 });
          Cookies.set("loginVisibility", "none", { expires: 1 });
          Cookies.set("accountVisibility", "block", { expires: 1 });
          isPremium(res.data.user);
        } else {
          setEmailError(true);
          setPassword("");
          setPasswordError(true);
          setNotification(res.data.error + "Please try again");
        }
      });
  };

  const handleSignUp = () => {
    props.setTrigger(false);
    props.setChange(true);
  };

  return props.trigger ? (
    <Box flex={5} width={350} padding={5}>
      <Box>
        <Stack direction={"column"} spacing={2}>
          <Typography variant="h6">Welcome to AirParts Customer Area.</Typography>
          <Typography className={emailError && passwordError ? "inavalid" : ""}>
            {notification}
          </Typography>
          <TextField
            id="username"
            label="Email"
            variant="filled"
            required
            error={emailError}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyPress={handleAnswerChange}
          />
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="filled"
            required
            error={passwordError}
            value={password}
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
            onChange={(event) => setPassword(event.target.value)}
            onKeyPress={handleAnswerChange}
          />

          <Stack
            className="boxButtons"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <Button
              className="clsButton"
              variant="contained"
              onClick={() => props.setTrigger(false)}
            >
              {" "}
              Cancel{" "}
            </Button>
            <Button
              className="login"
              variant="contained"
              onClick={handleLogin}
              disabled={!(email !== "" && password !== "")}
            >
              Login
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction={"column"}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ paddingTop: 5 }}
        >
          <Typography variant="h7">You do not have an AirParts user account yet?</Typography>
          <Button className="signUp" onClick={handleSignUp} sx={{ width: "33%" }}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Box>
  ) : (
    ""
  );
}

export default LoginPopup;
