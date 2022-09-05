import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const PasswordChange = ({ setSuccessfulChanged, setUnsuccessfulChange }) => {
  let navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [newPasswordVerify, setNewPasswordVerify] = useState("");
  const [newPasswordVerifyError, setNewPasswordVerifyError] = useState("");

  const { user } = useContext(AppContext);
  const config = { headers: { authorization: `Bearer ${user}` } };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordVerify, setShowNewPasswordVerify] = useState(false);

  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecials, setHasSpecials] = useState(false);
  const [hasLength, setHasLength] = useState(false);

  const handlePassword = (value) => {
    setNewPassword(value);
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

  const handleChangeVerify = (value) => {
    setNewPasswordVerify(value);
    if (value === newPassword) {
      setNewPasswordVerifyError(false);
    } else {
      setNewPasswordVerifyError(true);
    }
  };

  const handleEnter = (event) => {
    if (
      event.charCode === 13 &&
      newPassword === newPasswordVerify &&
      hasLength &&
      hasLowerCase &&
      hasUpperCase &&
      hasNumber &&
      hasSpecials
    ) {
      handleClick();
    }
  };

  const handleClick = () => {
    const update = {
      password: newPassword,
    };
    Axios.patch(`http://localhost:8080/user/profile/updatePassword`, update, config).then((res) => {
      if (res.status == 400) {
        setUnsuccessfulChange(true);
      } else {
        setSuccessfulChanged(true);
      }
    });
  };

  return (
    <Stack className="Change Password" spacing={2} padding={5} divider={<Divider flexItem />}>
      <Stack
        direction={"row"}
        spacing={20}
        justifyContent="flex-start"
        alignItems="stretch"
        bgcolor="white"
        padding={2}
      >
        <Typography variant="h4">Change password:</Typography>
        <Button
          variant="outlined"
          disabled={
            !(
              hasLength &&
              hasLowerCase &&
              hasUpperCase &&
              hasNumber &&
              hasSpecials &&
              !newPasswordVerifyError &&
              newPasswordVerify.length > 0
            )
          }
          onClick={() => handleClick()}
        >
          Update Password
        </Button>
      </Stack>

      <Stack direction={"row"} spacing={5}>
        <TextField
          id="password"
          type={showNewPassword ? "text" : "password"}
          label={
            !(hasLowerCase && hasUpperCase && hasNumber && hasSpecials && hasLength)
              ? "Enter New Password"
              : "Password"
          }
          value={newPassword}
          required
          error={
            !(hasLowerCase && hasUpperCase && hasNumber && hasSpecials && hasLength) &&
            newPassword.length > 0
          }
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  onMouseDown={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onFocus={() => setNewPasswordFocus(true)}
          onChange={(event) => handlePassword(event.target.value)}
          onKeyPress={handleEnter}
        />

        <TextField
          id="repeatPassword"
          type={showNewPasswordVerify ? "text" : "password"} // <-- This is where the magic happens.
          label={
            newPasswordVerifyError
              ? "Verify Password: Does not equal password above"
              : "Repeat Password"
          }
          value={newPasswordVerify}
          required
          error={newPasswordVerifyError}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPasswordVerify(!showNewPasswordVerify)}
                  onMouseDown={() => setShowNewPasswordVerify(!showNewPasswordVerify)}
                >
                  {showNewPasswordVerify ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(event) => handleChangeVerify(event.target.value)}
          onKeyPress={handleEnter}
        />
      </Stack>

      <Box display={newPasswordFocus ? "block" : "none"}>
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
  );
};

export default PasswordChange;
