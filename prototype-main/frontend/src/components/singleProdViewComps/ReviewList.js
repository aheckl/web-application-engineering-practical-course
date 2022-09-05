import { Stack } from "@mui/material";
import React from "react";
import Review from "./Review";
function ReviewList({ reviews }) {
  return (
    <Stack>
      {reviews.reverse().map((review) => {
        return <Review review={review}></Review>;
      })}
    </Stack>
  );
}

export default ReviewList;
