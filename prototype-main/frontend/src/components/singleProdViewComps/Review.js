import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";

function Review({ review }) {
  return (
    <Card flex={4} sx={{ maxWidth: 750 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
            {review.author.charAt(0)}
          </Avatar>
        }
        title={review.author}
        subheader={review.date?.slice(0, 10)}
      />
      <CardContent>
        <Rating sx={{ paddingBottom: 5 }} value={review.rating} size="large" readOnly></Rating>
        <Typography variant="body2" color="text.secondary">
          {review.text}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Review;
