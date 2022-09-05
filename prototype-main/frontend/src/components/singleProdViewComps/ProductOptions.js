import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Rating,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ReviewList from "./ReviewList";
import WriteReview from "./WriteReview";

const ProductOptions = ({ product, user, configuratorActive, setProduct }) => {
  const {
    configuration,
    setConfiguration,
    configurationDuration,
    profile,
    shoppingCart,
    setShoppingCart,
  } = useContext(AppContext);

  const [amount, setAmount] = useState(1);
  const [rentingTime, setRentingTime] = React.useState(configurationDuration);
  const [rating, setRating] = useState(0);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openReviewSnackBar, setOpenReviewSnackBar] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:8080/part/getbyid/${product?._id}`).then((result) => {
      setProduct(result.data);
    });
  }, [reviewPopup, showComments]);

  const handleRentingTime = (event) => {
    setRentingTime(event.target.value);
  };

  const handleAmountChange = (delta) => {
    var sum = amount + delta;
    if (sum <= 0 || sum > product.stock) {
      return;
    }
    setAmount(amount + delta);
  };

  const handleAddToCart = () => {
    if (configuratorActive) {
      var newConfiguration = configuration;
      newConfiguration[product.type] = product;
      setConfiguration(newConfiguration);
      navigate("/configurator");
    } else {
      if (Cookies.get("productsInShoppingCart")) {
        var newProductsArray = [
          ...shoppingCart,
          { _id: product._id, amount: amount, rentingTime: rentingTime },
        ];
        setShoppingCart(newProductsArray);
        Cookies.set("productsInShoppingCart", JSON.stringify(newProductsArray), { expires: 1 });
      } else {
        var newProductsArray = [{ _id: product._id, amount: amount, rentingTime: rentingTime }];
        setShoppingCart(newProductsArray);
        Cookies.set("productsInShoppingCart", JSON.stringify(newProductsArray), { expires: 1 });
      }
    }
    setOpenSnackBar(true);
  };

  const checkIfReviewed = () => {
    if (product?.reviews.find((review) => review.author_id == profile?._id)) {
      return true;
    } else {
      return false;
    }
  };

  const checkCanReview = () => {
    if (profile) {
      var canOrder = "";
      profile.orderHistory?.forEach((order) => {
        order.products.forEach((position) => {
          // is order position a config?
          if (position.configuration.length > 0) {
            // is config
            position.configuration.forEach((part) => {
              if (part == product?._id) {
                canOrder = order.date;
                return order.date;
              }
            });
          } else {
            // is no config
            if (position._id == product?._id) {
              canOrder = order.date;
              return order.date;
            }
          }
        });
      });
      return canOrder;
    } else {
      return "";
    }
  };

  return (
    <Box>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 550 }}>
          {product?.name}
        </Typography>
        <Typography variant="h5">{product?.manufacturer}</Typography>
        <Typography variant="h5">{product?.prices[rentingTime] + " € / month"}</Typography>
        <Stack direction="row" spacing={1}>
          <Rating
            value={
              product
                ? product.reviews.reduce((count, review) => {
                    return review.rating + count;
                  }, 0) / product.reviews.length
                : 0
            }
            readOnly={!user || checkIfReviewed() || !checkCanReview()}
            onChange={(event, newValue) => {
              setReviewPopup(true);
              setRating(newValue);
            }}
          ></Rating>
          <Link
            onClick={() => {
              if (product?.reviews.length > 0) {
                setShowComments(true);
              }
            }}
          >
            <Typography>({product?.reviews.length})</Typography>
          </Link>
        </Stack>
        {checkIfReviewed() ? (
          <Alert paddingTop={1} paddingBottom={5} severity="info">
            You reviewed this product
          </Alert>
        ) : (
          ""
        )}
        {checkCanReview() && !checkIfReviewed() ? (
          <Alert paddingTop={1} paddingBottom={5} severity="info">
            Rented on {checkCanReview().toLocaleString().slice(0, 10)}. Review this product now.
          </Alert>
        ) : (
          ""
        )}
        {/* <Typography paddingBottom={5}>{product.stock} in stock</Typography> */}
        <Dialog open={showComments} onClose={() => setShowComments(false)} scroll="paper">
          <DialogTitle>
            <Typography variant="h4">Reviews of {product?.name}</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText tabIndex={-1}>
              {user ? (
                <WriteReview
                  rating={rating}
                  user={user}
                  product={product}
                  setReviewPopup={setShowComments}
                  alreadyReviewed={checkIfReviewed()}
                  canReview={checkCanReview()}
                  setOpenReviewSnackBar={setOpenReviewSnackBar}
                ></WriteReview>
              ) : (
                ""
              )}
              <ReviewList reviews={product?.reviews} />
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions></DialogActions> */}
        </Dialog>

        <Dialog open={reviewPopup} onClose={() => setReviewPopup(false)} scroll="paper">
          <DialogTitle id="scroll-dialog-title">
            <Typography variant="h4">Review {product?.name}</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText
              id="scroll-dialog-description"
              //   ref={descriptionElementRef}
              tabIndex={-1}
            >
              <WriteReview
                rating={rating}
                user={user}
                product={product}
                setReviewPopup={setReviewPopup}
                alreadyReviewed={checkIfReviewed()}
                canReview={checkCanReview()}
                setOpenReviewSnackBar={setOpenReviewSnackBar}
              ></WriteReview>
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions></DialogActions> */}
        </Dialog>

        {!configuratorActive ? (
          <Box paddingTop={5}>
            <FormControl fullWidth>
              <InputLabel id="renting-time-select-label">Renting Time</InputLabel>
              <Select
                labelId="renting-time-select-label"
                id="renting-time-select"
                value={rentingTime}
                label="Renting Time"
                onChange={handleRentingTime}
                sx={{ backgroundColor: "white" }}
              >
                <MenuItem value={1}>1 Month</MenuItem>
                <MenuItem value={2}>2 Months</MenuItem>
                <MenuItem value={3}>3 Months</MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>12 Months</MenuItem>
                <MenuItem value={18}>18 Months</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="column" justifyContent="flex-start" alignItems="center">
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.1}>
                <IconButton>
                  <RemoveCircleOutlineOutlinedIcon onClick={() => handleAmountChange(-1)} />
                </IconButton>
                <Typography>{amount}</Typography>
                <IconButton onClick={() => handleAmountChange(1)}>
                  <AddCircleOutlineOutlinedIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ) : (
          ""
        )}

        <Button variant="contained" onClick={handleAddToCart}>
          {configuratorActive ? "Add to configuration " : "Add to Cart"}
        </Button>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        autoHideDuration={2500}
        onClose={() => {
          setOpenSnackBar(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Added to cart </Typography>
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openReviewSnackBar}
        autoHideDuration={2500}
        onClose={() => {
          setOpenReviewSnackBar(false);
        }}
      >
        <Alert
          onClose={() => setOpenReviewSnackBar(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Submitted Review</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductOptions;
