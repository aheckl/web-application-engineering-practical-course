import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Link,
  Snackbar,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Subscription = () => {
  let navigate = useNavigate();
  const { user, setLoginButtonPopup } = useContext(AppContext);
  const [monthlyPrice, setMonthlyPrice] = useState();
  const [annualPrice, setAnnualPrice] = useState();
  const [openSnackBarFailedSub, setOpenSnackBarFailedSub] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${user}` },
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "false") {
      navigate("/subscription");
      setOpenSnackBarFailedSub(true);
    }
    fetchMonthlyPrice();
    fetchAnnualPrice();
  }, []);

  const fetchUserPremiumState = async () => {
    const response = await axios.get("http://localhost:8080/user/profile", config).catch((err) => {
      console.log(err);
    });
    const premium = response.data.premium;
    return premium;
  };

  const fetchMonthlyPrice = async () => {
    const response = await axios
      .get("http://localhost:8080/subscription/price/monthly")
      .catch((err) => {
        console.log(err);
      });
    const price = response.data.unit_amount;
    setMonthlyPrice(price / 100); //convert price in Cent into Euro
  };

  const fetchAnnualPrice = async () => {
    const response = await axios
      .get("http://localhost:8080/subscription/price/annual")
      .catch((err) => {
        console.log(err);
      });
    const price = response.data.unit_amount;
    setAnnualPrice(price / 100); //convert price in Cent into Euro
  };

  const subscribeMonthly = () => {
    if (user) {
      fetchUserPremiumState().then((premium) => {
        if (!premium) {
          axios
            .post("http://localhost:8080/subscription/session/monthly", {}, config)
            .then((res) => {
              if (res.data.url) {
                window.location.href = res.data.url;
              }
            })
            .catch((err) => console.log(err.message));
        } else {
          navigate("/profile");
        }
      });
    } else {
      setLoginButtonPopup(true);
    }
  };

  const subscribeAnnual = () => {
    if (user) {
      fetchUserPremiumState().then((premium) => {
        if (!premium) {
          axios
            .post("http://localhost:8080/subscription/session/annual", {}, config)
            .then((res) => {
              if (res.data.url) {
                window.location.href = res.data.url;
              }
            })
            .catch((err) => console.log(err.message));
        } else {
          navigate("/profile");
        }
      });
    } else {
      setLoginButtonPopup(true);
    }
  };

  return (
    <Box>
      <Box paddingTop={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Premium Membership</Typography>
        </Breadcrumbs>
      </Box>
      <Grid container justifyContent="space-evenly" alignItems="center" paddingTop={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#3D80E1" }}>
            <CardContent align="center">
              <Typography variant="h3" color="white" fontWeight="light" padding={2}>
                AirParts Premium Membership
              </Typography>
              <Typography variant="h5" color="white" padding={2}>
                Subscribe as a Premium Member to unlock exclusive benefits!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid container spacing={2} paddingTop={5} paddingBottom={5}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ minHeight: 282.84 }}>
              <CardContent align="center">
                <FastForwardOutlinedIcon sx={{ fontSize: 150, color: "#3d80e1" }} />
                <Typography variant="h6" fontSize={18} fontWeight="bold">
                  Fast Delivery
                </Typography>
                <Typography variant="body2">
                  All orders will be shipped by express delivery
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ minHeight: 282.84 }}>
              <CardContent align="center">
                <LocalShippingOutlinedIcon sx={{ fontSize: 150, color: "#3d80e1" }} />
                <Typography variant="h6" fontSize={18} fontWeight="bold">
                  Free Delivery
                </Typography>
                <Typography variant="body2">All orders will be shipped for free</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ minHeight: 282.84 }}>
              <CardContent align="center">
                <EmojiEventsOutlinedIcon sx={{ fontSize: 150, color: "#3d80e1" }} />
                <Typography variant="h6" fontSize={18} fontWeight="bold">
                  Component Priority
                </Typography>
                <Typography variant="body2">
                  Early Access and waiting list priority for new and highly demanded hardware
                  components
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card>
              <CardActionArea sx={{ minHeight: 282.84 }} href="/subscription/details">
                <CardContent align="center">
                  <ReadMoreOutlinedIcon sx={{ fontSize: 150, color: "#3d80e1" }} />
                  <Typography variant="h6" fontSize={18} fontWeight="bold" color="#3D80E1">
                    More Details
                  </Typography>
                  <Typography variant="body2" color="#3D80E1">
                    Click here to read about further benefits, all details and more information
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6} paddingBottom={2} paddingRight={1}>
          <Card>
            <CardContent align="center">
              <Typography variant="h5" color="#3D80E1" fontWeight="bold">
                Monthly Subscription
              </Typography>
              <Typography variant="body2">Cancel anytime within the month</Typography>
              <Typography variant="h5" paddingTop={2} paddingBottom={2}>
                {monthlyPrice} € per month
              </Typography>
              <Box>
                <Button color="error" variant="contained" onClick={() => subscribeMonthly()}>
                  Subscribe
                </Button>
              </Box>
              <Link fontSize={12} href="/terms">
                Terms and Conditions
              </Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} paddingBottom={2} paddingLeft={1}>
          <Card>
            <CardContent align="center">
              <Typography variant="h5" color="#3D80E1" fontWeight="bold">
                Annual Subscription
              </Typography>
              <Typography variant="body2">Cancel anytime within the year</Typography>
              <Typography variant="h5" paddingTop={2} paddingBottom={2}>
                {annualPrice} € per year
              </Typography>

              <Box>
                <Button color="error" variant="contained" onClick={() => subscribeAnnual()}>
                  Subscribe
                </Button>
              </Box>
              <Link fontSize={12} href="/terms">
                Terms and Conditions
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* ------------------- Snackbar SignUp Unsuccessful ---------------------- */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBarFailedSub}
          autoHideDuration={1500}
          onClose={() => {
            setOpenSnackBarFailedSub(false);
          }}
        >
          <Alert
            onClose={() => setOpenSnackBarFailedSub(false)}
            severity="warning"
            sx={{ width: "100%" }}
            icon={<ErrorOutlineOutlinedIcon fontSize={"large"} />}
          >
            <Typography variant="h5">Subscription process aborted</Typography>
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default Subscription;
