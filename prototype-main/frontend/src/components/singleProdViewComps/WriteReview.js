import SendIcon from "@mui/icons-material/Send";
import { Alert, Button, Rating, Stack, TextField } from "@mui/material";
import Axios from "axios";
import { useState } from "react";

function WriteReview({
  rating,
  user,
  product,
  setReviewPopup,
  alreadyReviewed,
  canReview,
  setOpenReviewSnackBar,
}) {
  const [newRating, setNewRating] = useState(rating);
  const [reviewText, setReviewText] = useState("");
  const config = {
    headers: { Authorization: `Bearer ${user}` },
  };

  const handleSendReview = () => {
    let today = new Date();

    Axios.patch(
      "http://localhost:8080/part/" + product._id + "/review",
      { text: reviewText, date: today, rating: newRating },
      config
    )
      .then((response) => {
        if (response.status == 200) {
          setOpenReviewSnackBar(true);
          setReviewPopup(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Stack>
      <Rating
        sx={{ paddingBottom: 5 }}
        value={newRating}
        size="large"
        onChange={(event, newValue) => {
          setNewRating(newValue);
        }}
        readOnly={alreadyReviewed || !canReview}
      ></Rating>

      <TextField
        p={1}
        id="outlined-textarea"
        label="Explain "
        placeholder=""
        multiline
        rows={5}
        onChange={(event) => setReviewText(event.target.value)}
      />

      <Button
        endIcon={<SendIcon />}
        onClick={handleSendReview}
        disabled={alreadyReviewed || !canReview}
      >
        Send
      </Button>
      {alreadyReviewed ? (
        <Alert paddingTop={1} paddingBottom={5} severity="info">
          You already reviewed this product
        </Alert>
      ) : (
        ""
      )}
      {canReview && !alreadyReviewed ? (
        <Alert paddingTop={1} paddingBottom={5} severity="info">
          Rented on {canReview.toLocaleString().slice(0, 10)}. Review this product now.
        </Alert>
      ) : (
        ""
      )}
    </Stack>
  );
}

export default WriteReview;
