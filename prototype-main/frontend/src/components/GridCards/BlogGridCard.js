import React from "react";
import { Card } from "@mui/material";
import { Grid, Stack } from "@mui/material";
import { CardActionArea, CardMedia, CardContent, CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
// import { Link } from "react-router-dom";
// import { withRouter } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function BlogGridCard(props) {
  let navigate = useNavigate();
  const card = props.card;
  card.user = props.user;
  card.likeCount = card.likes.length;

  if (!card.image) {
    card.image = "typewriter.jpg";
  }

  return (
    <Grid item sm={12} md={6} lg={4}>
      <Card sx={{ maxWidth: 500 }} elevation={1}>
        <Stack direction="column" justifyContent="center" alignItems="center">
          <CardActionArea
            /*  href={"/blogarticle/" + card._id} */ onClick={() =>
              navigate("/blogarticle/" + card._id, { state: card })
            }
          >
            <CardMedia
              component="img"
              height="70%"
              image={require("../../static/images/blog/" + card.image)}
              alt="Blog_Article_PIC"
            />
            <CardContent align="center">
              <Typography gutterBottom variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" text-align="center">
                {card.dateStr}
              </Typography>

              <Typography paddingTop={2} variant="body2" color="text.secondary">
                {card.previewText}
              </Typography>

              <Typography paddingTop={2}>{"Written by " + card.author}</Typography>
            </CardContent>
          </CardActionArea>

          <CardActions align="center">
            {/* <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Bookmark
          </Button>*/}
            <Typography>
              {card.likeCount == 1 ? card.likeCount + " Like" : card.likeCount + " Likes"}
            </Typography>
          </CardActions>
        </Stack>
      </Card>
    </Grid>
  );
}

export default BlogGridCard;
