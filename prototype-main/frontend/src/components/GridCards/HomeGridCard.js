import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { CardActionArea, CardContent, CardMedia, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function HomeGridCard(props) {
  let navigate = useNavigate();
  return (
    <Grid item sm={props.card.columns.xs} md={props.card.columns.md} lg={props.card.columns.lg}>
      <Card>
        {/* <Link to={String(props.card.link)}> */}
        <CardActionArea onClick={() => navigate(props.card.link)}>
          <CardMedia
            height={450}
            component="img"
            image={require("../../static/images/landing/" + props.card.image)}
            // warum geht das nicht??
            // image = {require(props.card.image)}
            alt="CardPic"
          />
        </CardActionArea>
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={2}>
            <Typography variant="h4">{props.card.text}</Typography>
          </Stack>
        </CardContent>
        {/* </Link> */}
      </Card>
    </Grid>
  );
}

export default HomeGridCard;
