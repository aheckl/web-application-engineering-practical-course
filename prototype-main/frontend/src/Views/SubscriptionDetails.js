import React from "react";
import { Box, Card, CardContent, Grid, Link, Typography, Breadcrumbs } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const SubscriptionDetails = () => {
  return (
    <Box>
      <Box paddingTop={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/subscription">
            Premium Membership
          </Link>
          <Typography color="text.primary">Details</Typography>
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
                Description of exclusive benefits for Premium Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} paddingTop={5}>
          <Card>
            <CardContent align="center">
              <FastForwardOutlinedIcon sx={{ fontSize: 100, color: "#3d80e1" }} />
              <Typography variant="h6" fontSize={18} fontWeight="bold">
                Fast Delivery
              </Typography>
              <Typography variant="body2">
                All orders will be shipped by express delivery. Usually our shipping time is 2 days.
                With the Premium Membership we will provide Next-Day-Delivery (except on Saturdays
                and Sundays).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} paddingTop={5}>
          <Card>
            <CardContent align="center">
              <LocalShippingOutlinedIcon sx={{ fontSize: 100, color: "#3d80e1" }} />
              <Typography variant="h6" fontSize={18} fontWeight="bold">
                Free Delivery
              </Typography>
              <Typography variant="body2">
                All orders will be shipped for free. For every shipment we normally take a delivery
                fee. As Premium Member, you do not have to worry about any fees. Order as often and
                as many items as you like. All of them will be shipped to you for free as part of
                the premium delivery.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} paddingTop={5}>
          <Card>
            <CardContent align="center">
              <EmojiEventsOutlinedIcon sx={{ fontSize: 100, color: "#3d80e1" }} />
              <Typography variant="h6" fontSize={18} fontWeight="bold">
                Component Priority
              </Typography>
              <Typography variant="body2">
                Early Access and waiting list priority for new and highly demanded hardware
                components. When browsing our shop as Premium Member you will come across products
                that are tagged as Premium Products. You will be in the exclusive position to rent
                them. They are not available to standard customers which will give you the
                opportunity to get your hands on highly demanded computer parts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionDetails;
