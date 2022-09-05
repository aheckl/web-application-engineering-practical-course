import React from "react";
import { Grid, CardActionArea, Avatar, Typography } from "@mui/material";

function AboutGridCard({ image, name, link }) {
  return (
    <Grid item sm={12} md={12} lg={3}>
      <CardActionArea href={link}>
        <Avatar alt="Remy Sharp" src={image} sx={{ width: "100%", height: "50%" }} />
      </CardActionArea>
      <Typography align="center" padding={5} variant="h4">
        {name}
      </Typography>
    </Grid>
  );
}

export default AboutGridCard;
