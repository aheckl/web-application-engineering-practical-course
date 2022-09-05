import { useEffect, useState, useContext, React } from "react";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { AppContext } from "../../Context/AppContext";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSummary = ({ setSuccessfulChanged, setUnsuccessfulChange }) => {
  let navigate = useNavigate();
  const { user, profile, setProfile } = useContext(AppContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const config = { headers: { authorization: `Bearer ${user}` } };

  useEffect(() => {
    setFirstName(profile.firstname);
    setLastName(profile.lastname);
    setPostalCode(profile.postcode);
    setAddress(profile.address);
    setCity(profile.city);
    setCountry(profile.country);
  }, [profile]);

  const handleClick = () => {
    const update = {
      firstname: firstName,
      lastname: lastName,
      postcode: postalCode,
      address: address,
      city: city,
      country: country,
    };
    //Update Profile Data in Backend
    Axios.patch(`http://localhost:8080/user/profile/updateProfile`, update, config).then((res) => {
      if (res.status == 400) {
        setUnsuccessfulChange(true);
      } else {
        setSuccessfulChanged(true);
        Axios.get(`http://localhost:8080/user/profile`, config)
          .then((result) => {
            setProfile(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <Stack
      className="ProfileView"
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={2}
    >
      <Stack spacing={2} padding={5} divider={<Divider flexItem />}>
        <Stack
          direction={"row"}
          spacing={20}
          justifyContent="flex-start"
          alignItems="stretch"
          padding={2}
        >
          <Typography variant="h4">My profile summary:</Typography>
          <Button
            variant="outlined"
            disabled={
              (firstName === profile.firstname || firstName === "") &&
              (lastName === profile.lastname || lastName === "") &&
              postalCode === profile.postcode &&
              (address === profile.address || address === "") &&
              (city === profile.city || city === "") &&
              (country === profile.country || country === "")
            }
            onClick={() => handleClick()}
          >
            Update Profile
          </Button>
        </Stack>

        {/* Visualize Profile Data */}
        <Stack direction={"row"} spacing={5}>
          <Stack
            spacing={2}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            padding={2}
          >
            <TextField
              value={firstName}
              label="First Name"
              required
              sx={{ maxWidth: 500 }}
              onChange={(event) => setFirstName(event.target.value)}
            ></TextField>
            <TextField
              value={address}
              label="Address"
              required
              sx={{ maxWidth: 500 }}
              onChange={(event) => setAddress(event.target.value)}
            ></TextField>
            <TextField
              value={postalCode}
              label="Postal Code"
              sx={{ maxWidth: 500 }}
              onChange={(event) => setPostalCode(event.target.value)}
            ></TextField>
          </Stack>

          <Stack
            spacing={2}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            padding={2}
          >
            <TextField
              value={lastName}
              label="Last Name"
              required
              sx={{ maxWidth: 500 }}
              onChange={(event) => setLastName(event.target.value)}
            ></TextField>
            <TextField
              value={city}
              label="City"
              required
              sx={{ maxWidth: 500 }}
              onChange={(event) => setCity(event.target.value)}
            ></TextField>
            <TextField
              value={country}
              label="Country"
              required
              sx={{ maxWidth: 500 }}
              onChange={(event) => setCountry(event.target.value)}
            ></TextField>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProfileSummary;
