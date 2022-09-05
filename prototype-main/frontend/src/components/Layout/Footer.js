import { CardMedia, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import React from "react";
import { Link } from "react-router-dom";

const logoTransparent = require("../../static/images/footer/airparts-logo-footer-transparent.png");
const partnerLogosMediumTransparent = require("../../static/images/footer/partnersMediumTransparent.png");

const Footer = () => {
  return (
    <Box flex={6} padding={5}>
      <Divider />
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Typography sx={{ color: "gray" }} paddingTop={5}>
          Our Partners
        </Typography>
        <Typography>
          <CardMedia component="img" image={partnerLogosMediumTransparent}></CardMedia>
        </Typography>
        <Typography sx={{ color: "gray" }} paddingBottom={5}>
          and many more ...
        </Typography>
      </Stack>

      <Divider />

      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        paddingTop={5}
      >
        <Typography sx={{ color: "gray" }}>© 2022 Airparts Inc. All rights reserved.</Typography>
        <Link to={"/"}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <img className="companyLogo" src={logoTransparent} width={205} />
          </Box>
        </Link>
        <Typography sx={{ color: "gray" }}>
          All prices incl. 19% VAT. excl. shipping costs
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
