import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import ConfigurationSummary from "../components/Checkout/ConfigurationSummary";
import DeliveryAndPaymentSummary from "../components/Checkout/DeliveryAndPaymentSummary";
import ShoppingCartSummary from "../components/Checkout/shoppingCartSummary";
import SingleProductSummary from "../components/Checkout/SingleProductSummary";
import { AppContext } from "../Context/AppContext";

const ShoppingCart = () => {
  const {
    shoppingCart,
    setShoppingCart,
    user,
    premiumUser,
    setLoginButtonPopup,
    products,
    setProducts,
    profile,
  } = useContext(AppContext);
  const [checkOutRequested, setCheckOutRequested] = useState(false);
  const [successfulPaid, setSuccessfulPaid] = useState(false);
  const [unsuccessfulPaid, setUnsuccessfulPaid] = useState(false);
  const [costOfDeposit, setCostOfDeposit] = useState(0);
  const [costOfProduct, setCostOfProduct] = useState(0);
  const [dateDelivery, setDateDelivery] = useState("");
  const [priceSplit, setPriceSplit] = useState({ 1: 0, 2: 0, 3: 0, 6: 0, 12: 0, 18: 0 });
  const [priceSplitCumulative, setPriceSplitCumulative] = useState({
    1: 0,
    2: 0,
    3: 0,
    6: 0,
    12: 0,
    18: 0,
  });
  const params = new URLSearchParams(window.location.search);

  const config = { headers: { authorization: `Bearer ${Cookies.get("user")}` } };

  const today = new Date();
  const calculateDeliveryDay = (x, y, setter) => {
    today.setDate(today.getDate() + x);
    setter(
      today.toLocaleString("en-US", { weekday: "short" }) + ", " + today.toLocaleDateString() + y
    );
  };

  var productIds = [];

  useEffect(() => {
    if (params.get("success") == "true" && params.get("key")) {
      Cookies.remove("productsInShoppingCart");
      setShoppingCart([]);
      Axios.patch(
        `http://localhost:8080/user/addOrderToOrderHistory/${params.get("key")}`,
        {},
        config
      )
        .then((result) => {
          if (result.status == 200) {
            setSuccessfulPaid(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (params.get("success") == "false") {
      setUnsuccessfulPaid(true);
    }
  }, []);

  useEffect(() => {
    if (
      today.toLocaleString("en-US", { weekday: "long" }) === "Friday" ||
      today.toLocaleString("en-US", { weekday: "long" }) === "Saturday" ||
      today.toLocaleString("en-US", { weekday: "long" }) === "Sunday"
    ) {
      if (!premiumUser) {
        calculateDeliveryDay(3, "", setDateDelivery);
      } else {
        if (today.toLocaleString("en-US", { weekday: "long" }) === "Friday") {
          calculateDeliveryDay(1, " (Premium Delivery)", setDateDelivery);
        } else {
          calculateDeliveryDay(2, " (Premium Delivery)", setDateDelivery);
        }
      }
    } else {
      if (!premiumUser) {
        calculateDeliveryDay(2, "", setDateDelivery);
      } else {
        calculateDeliveryDay(1, " (Premium Delivery)", setDateDelivery);
      }
    }
  }, [profile, shoppingCart]);

  useEffect(() => {
    if (shoppingCart.length > 0) {
      for (let i = 0; i < shoppingCart.length; i++) {
        if (!shoppingCart[i].configuration) {
          productIds = [...productIds, shoppingCart[i]._id];
        } else {
          Object.values(shoppingCart[i].configuration).forEach((elem) => {
            productIds = [...productIds, elem];
          });
        }
      }

      var configurations = [];

      Axios.get(`http://localhost:8080/part/getIds/id`, {
        params: {
          _id: productIds,
        },
      })
        .then((result) => {
          setProducts(result.data);
          var resultArray = [];

          for (var s of shoppingCart) {
            if (s.configuration) {
              var configuration = {};
              configuration.configuration = {};
              Object.keys(s.configuration).forEach((key) => {
                configuration.configuration[key] = result.data.find((elem) => {
                  return elem._id == s.configuration[key];
                });
                configuration._id = s._id;
                configuration.amount = s.amount;
                configuration.rentingTime = s.rentingTime;
                configuration.prices = s.prices;
              });
              configurations = [...configurations, configuration];
            } else {
              var itemData = { ...result.data.find((elem) => elem._id == s._id) };
              itemData.amount = s.amount;
              itemData.rentingTime = s.rentingTime;

              if (resultArray.length > 0) {
                for (let k = 0; k < resultArray.length; k++) {
                  if (
                    resultArray[k]._id == itemData._id &&
                    resultArray[k].rentingTime == itemData.rentingTime
                  ) {
                    resultArray[k].amount += itemData.amount;
                    break;
                  }
                  if (k == resultArray.length - 1) {
                    resultArray = [...resultArray, itemData];
                    break;
                  }
                }
              } else {
                resultArray = [itemData];
              }
            }
          }

          setProducts([...configurations, ...resultArray]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setCheckOutRequested(false);
      setProducts([]);
    }

    //merge 2 useEffect with same trigger
  }, [shoppingCart]);

  useEffect(() => {
    var amount = products.reduce((sum, product) => {
      return product.prices[product.rentingTime] * product.amount + sum;
    }, 0);
    setCostOfProduct(amount);
    setCostOfDeposit(amount);

    var temp = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 12: 0, 18: 0 };
    products?.forEach((product) => {
      var sum = temp[product.rentingTime] + product.prices[product.rentingTime] * product.amount;
      temp[product.rentingTime] = sum;
    });
    setPriceSplit(temp);
    var processed = [];
    var temp2 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 12: 0, 18: 0 };
    for (var i of Object.keys(temp)) {
      for (var j of Object.keys(temp).filter((key) => {
        return !(key in processed);
      })) {
        temp2[i] = temp2[i] + temp[j];
      }
      processed.push(i);
    }
    setPriceSplitCumulative(temp2);
  }, [products]);

  const compareCartFunction = (a, b) => {
    if (a._id < b._id) {
      return 1;
    } else if (a._id == b._id) {
      return a.rentingTime < b.rentingTime ? 1 : -1;
    } else {
      return -1;
    }
  };

  const handleClose = () => {
    setCheckOutRequested(!checkOutRequested);
  };

  return (
    <Stack
      flex={6}
      bgcolor="#F3F3F3"
      padding={2}
      direction="column"
      spacing={2}
      justifyContent="center"
    >
      {products.length > 0 ? (
        <Stack direction={"row"} spacing={4}>
          <Stack direction="column" spacing={5} justifyContent="flex-start" alignItems="flex-start">
            <Stack
              direction="column"
              spacing={4}
              justifyContent="center"
              alignItems="flex-start"
              bgcolor="white"
              padding={2}
            >
              <Typography variant="h5">
                Your Cart ({products.length} item{products.length > 1 ? "s" : ""})
              </Typography>
              {shoppingCart ? (
                products.sort(compareCartFunction).map((elem) => {
                  return elem.configuration ? (
                    <ConfigurationSummary
                      configuration={elem}
                      key={elem._id}
                    ></ConfigurationSummary>
                  ) : (
                    <SingleProductSummary part={elem} key={elem._id}></SingleProductSummary>
                  );
                })
              ) : (
                <Typography variant="h4"></Typography>
              )}
            </Stack>
          </Stack>
          <ShoppingCartSummary
            user={user}
            premiumUser={premiumUser}
            costOfProduct={costOfProduct}
            costOfDeposit={costOfDeposit}
            dateDelivery={dateDelivery}
            setLoginButtonPopup={setLoginButtonPopup}
            setCheckOutRequested={setCheckOutRequested}
          ></ShoppingCartSummary>
        </Stack>
      ) : (
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Typography paddingTop={10} variant="h5" align="center">
            {params.get("success") == "true"
              ? "Thank you for your purchase. You will receive a confirmation E-Mail. "
              : "Browse for components and add them into your shopping cart"}
          </Typography>
          <Button variant="contained" href="/">
            Continue shopping
          </Button>
        </Stack>
      )}
      {/* checkout Dialog */}
      <Dialog
        open={checkOutRequested}
        onClose={() => handleClose()}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h4">Checkout</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            //   ref={descriptionElementRef}
            tabIndex={-1}
          >
            <DeliveryAndPaymentSummary
              products={products}
              costOfProduct={costOfProduct}
              costOfDeposit={costOfDeposit}
              setSuccessfulPaid={setSuccessfulPaid}
              dateDelivery={dateDelivery}
            ></DeliveryAndPaymentSummary>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successfulPaid}
        autoHideDuration={1500}
        onClose={() => {
          {
            setSuccessfulPaid(false);
          }
        }}
      >
        <Alert
          onClose={() => setSuccessfulPaid(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Your order has been Paid successfully.</Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={unsuccessfulPaid}
        autoHideDuration={1500}
        onClose={() => {
          {
            setUnsuccessfulPaid(false);
          }
        }}
      >
        <Alert
          onClose={() => setUnsuccessfulPaid(false)}
          severity="error"
          sx={{ width: "100%" }}
          icon={<ErrorOutlineOutlinedIcon fontSize={"large"} />}
        >
          <Typography variant="h5">The payment process has been aborted!</Typography>
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ShoppingCart;
