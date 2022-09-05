import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import ProductGridCard from "../components/findProduct/ProductGridCard";
import HomeGridCard from "../components/GridCards/HomeGridCard";
import { AppContext } from "../Context/AppContext";

function Home(props) {
  let navigate = useNavigate();
  const { premiumUser, setPremiumUser } = useContext(AppContext);
  const [openSnackBarSubscribe, setOpenSnackBarSubscribe] = useState(false);
  const [openSnackBarUnsubscribe, setOpenSnackBarUnsubscribe] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const cardData = [
    {
      text: "Processors",
      link: "/shop/cpu",
      buttonText: "",
      image: "cpu.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Graphics Cards",
      link: "/shop/gpu",
      buttonText: "",
      image: "gpu.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Mainboards",
      link: "/shop/mainboard",
      buttonText: "",
      image: "mainboard.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Cases",
      link: "/shop/case",
      buttonText: "",
      image: "case.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Memory",
      link: "/shop/ram",
      buttonText: "",
      image: "ram.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Drives",
      link: "/shop/drive",
      buttonText: "",
      image: "drive.jpg",
      height: 250,
      columns: { xs: 12, md: 6, lg: 6 },
    },
    {
      text: "Second Hand Deals",
      link: "/shop/secondHand",
      buttonText: "",
      image: "secondhand.jpg",
      height: 250,
      columns: { xs: 12, md: 12, lg: 12 },
    },
  ];

  //Do not display premium advertisement if user is already premium user
  const items = () =>
    premiumUser
      ? [
          {
            image: "blog_banner.png",
            link: "/blogarticle/62cd33ca48b525983d5cd814",
          },
          {
            image: "configurator_banner.png",
            link: "/configurator",
          },
        ]
      : [
          {
            image: "blog_banner.png",
            link: "/blogarticle/62cd33ca48b525983d5cd814",
          },
          {
            image: "configurator_banner.png",
            link: "/configurator",
          },
          {
            image: "premium_banner.png",
            link: "/subscription",
          },
        ];

  function BannerItem(props) {
    return (
      <Box onClick={() => navigate(props.item.link)}>
        <img
          width={"100%"}
          src={require(`../static/images/landing/banner/${props.item.image}`)}
        ></img>
      </Box>
    );
  }

  useEffect(() => {
    //Test if Subscription has been executed
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id") && params.get("frequency")) {
      let config = { headers: { authorization: `Bearer ${Cookies.get("user")}` } };
      axios
        .get("http://localhost:8080/subscription/checkout" + window.location.search, config)
        .then((res) => {
          if (res.status == 200) {
            navigate("");
            setPremiumUser(true);
            setOpenSnackBarSubscribe(true);
          }
        });
    }

    if (params.get("unsubscribe") === "true") {
      navigate("");
      setOpenSnackBarUnsubscribe(true);
    }
    //Get Featured Products
    axios
      .get(`http://localhost:8080/part/`, {
        params: {
          featured: true,
        },
      })
      .then((result) => {
        setFeaturedProducts(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box flex={6} paddingTop={5}>
      <Carousel padding={5} changeOnFirstRender={true} index={1} interval={4000}>
        {/* Set single Banners in Carousel */}
        {items().map((item, i) => (
          <BannerItem key={i} item={item} />
        ))}
      </Carousel>
      <Typography variant="h4">Featured Parts</Typography>
      <Grid container spacing={3}>
        {featuredProducts.map((prod) => (
          <ProductGridCard product={prod} configuratorActive={false} key={prod._id} />
        ))}
      </Grid>
      <Typography variant="h4" paddingTop={5}>
        All Categories
      </Typography>
      <Grid container spacing={3}>
        {cardData.map((card) => (
          <HomeGridCard card={card} key={card.text} />
        ))}
      </Grid>

      {/* ------------------- Snackbar Subscription Successful ---------------------- */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBarSubscribe}
        autoHideDuration={1500}
        onClose={() => {
          setOpenSnackBarSubscribe(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBarSubscribe(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">Your Subscription has been accepted!</Typography>
        </Alert>
      </Snackbar>

      {/* ------------------- Snackbar Unsubscription Successful ---------------------- */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBarUnsubscribe}
        autoHideDuration={1500}
        onClose={() => {
          setOpenSnackBarUnsubscribe(false);
        }}
      >
        <Alert
          onClose={() => setOpenSnackBarUnsubscribe(false)}
          severity="success"
          sx={{ width: "100%" }}
          icon={<CheckCircleOutlineIcon fontSize={"large"} />}
        >
          <Typography variant="h5">You are unsubscribed from AirParts Premium!</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;
