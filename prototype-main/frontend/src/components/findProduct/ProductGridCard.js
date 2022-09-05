import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

function ProductGridCard({ product, configuratorActive }) {
  const { configuration, configurationDuration } = useContext(AppContext);

  let navigate = useNavigate();
  return (
    <Grid item sm={12} md={4} lg={3}>
      <Card>
        <CardActionArea
          sx={{ padding: 1 }}
          onClick={() => {
            product.configuratorActive = configuratorActive;
            navigate("/productDetails/" + product._id, {
              state: product,
            });
          }}
        >
          <CardMedia
            component="img"
            image={require("../../../public/cards/all/" + product.cardImage)}
            alt="Blog_Article_PIC"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography>{product.manufacturer}</Typography>
            <Typography variant="body2" color="text.secondary">
              {product.prices[configurationDuration]} € / month
            </Typography>
            <Rating
              value={
                product
                  ? product.reviews.reduce((count, review) => {
                      return review.rating + count;
                    }, 0) / product.reviews.length
                  : 0
              }
              readOnly
              size="small"
            ></Rating>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default ProductGridCard;
