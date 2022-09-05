import { Breadcrumbs, Card, Grid, Link, Stack, Typography, Box } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AboutGridCard from "../components/GridCards/AboutGridCard";

const logo = require("../static/images/AIRPARTS_Logo_transparent.png");

const imgAndi = require("../static/images/andi_squared.jpg");
const imgDennis = require("../static/images/Dennis_squared.jpg");
const imgJoh = require("../static/images/johannes_squared.png");
const imgRaul = require("../static/images/raul_squared.png");
const imgWidth = "200";
const imgHeight = "300";

const About = () => {
  return (
    <Box flex={6} padding={5}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">About</Typography>
        </Breadcrumbs>
      </Box>
      <Card>
        <Typography paddingTop={5} variant="h3" align="center" sx={{ color: "#3D80E1" }}>
          About AirParts
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={10}
          padding={10}
        >
          <Box maxWidth={"50%"}>
            <Typography variant="h5" align="left" style={{ color: "black" }}>
              AirParts is a renting service that helps its customers to obtain their desired
              hardware components for a PC with a few simple clicks.<br></br> Our mission is clear:
              We want to make high-quality hardware affordable for YOU.
            </Typography>
          </Box>
          <Box maxWidth={"50%"}>
            <img src={logo} width="80%"></img>
          </Box>
        </Stack>

        <Typography variant="h2" align="center" paddingTop={10}>
          Our Developer Team
        </Typography>
        <Grid container justifyContent="space-around" alignItems="center" spacing={5} padding={10}>
          <AboutGridCard
            image={imgAndi}
            name="Andreas Heckl"
            link="mailto:andreas.heckl@tum.de"
          ></AboutGridCard>
          <AboutGridCard
            image={imgDennis}
            name="Dennis Gurewitsch"
            link="mailto:dennis.gurewitsch@tum.de"
          ></AboutGridCard>
          <AboutGridCard
            image={imgRaul}
            name="Raul Fernandez"
            link="mailto:raul.fernandez@tum.de"
          ></AboutGridCard>
          <AboutGridCard
            image={imgJoh}
            name="Johannes Friedlein"
            link="mailto:johannes.friedlein@tum.de"
          ></AboutGridCard>
        </Grid>
        <Typography paddingLeft={5} paddingRight={5} variant="h5" align="justify" lineHeight={1.5}>
          Here at AirParts, our mission is clear: We want to make high-quality hardware affordable
          for YOU. <br /> We are Dennis, Johannes, Andi and Raul. We all study information systems
          together at the Technical University of Munich.
          <br /> <br /> With AirParts, you don't have to spend thousands of euros to get
          high-quality computer hardware. If you want to play the latest video games on the highest
          settings, we offer you the possibility to rent the necessary components. <br /> <br />
          The idea for our business model came from exactly this motivation: Like most students, we
          were always short of money, but we wanted to have high-quality hardware. We are sure you
          can relate to that: Mechanics want to drive good cars themselves, tailors want good
          fitting clothes themselves, and computer scientists want to use good hardware themselves.
          So we started looking for an online service that rents out hardware components.
          Unfortunately, we only found online shops where you could buy the components at full price
          or rental services that only rented out fully assembled PCs or laptops. Nowadays, you can
          rent so many types of products that we were a bit surprised. From cars to ski equipment to
          cell phones, but no graphics card or processor. That's why we decided to fill this gap in
          the market and start our own online store. <br /> If you find yourself in a similar
          situation as we did, we would be happy if you take a look around our site and find a
          product that suits you. <br /> <br />
          If you are convinced of our service, you might also consider a{" "}
          <RouterLink to={"../subscription"} style={{ color: "black" }}>
            {"Premium Subscription"}
          </RouterLink>
          , which brings you many advantages for little money. <br /> <br />
          Airparts is not only an online store, but we have also created a{" "}
          <RouterLink to={"../blog"} style={{ color: "black" }}>
            {"blog"}
          </RouterLink>
          , where we regularly write about topics from the hardware world. There you can find e.g.
          news about products or instructions how to assemble your own PC. You can also leave
          comments on blog articles and ask us questions. <br /> <br />
          Your Founding Team Members
        </Typography>
      </Card>
    </Box>
  );
};

export default About;
