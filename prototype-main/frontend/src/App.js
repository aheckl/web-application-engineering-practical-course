import { Box, Stack } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ApplicationBar from "./components/Layout/ApplicationBar";
import ClippedDrawer from "./components/Layout/ClippedDrawer";
import Footer from "./components/Layout/Footer";
import { AppContext } from "./Context/AppContext";
import About from "./Views/About";
import Blog from "./Views/Blog";
import BlogDetail from "./Views/BlogDetail";
import Configurator from "./Views/Configurator";
import Contact from "./Views/Contact";
import Faq from "./Views/Faq";
import FindProduct from "./Views/FindProduct";
import Home from "./Views/Home";
import ProductDetail from "./Views/ProductDetail";
import Profile from "./Views/Profile";
import ShoppingCart from "./Views/ShoppingCart";
import Subscription from "./Views/Subscription";
import SubscriptionDetails from "./Views/SubscriptionDetails";
import Terms from "./Views/Terms";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({});
  const [premiumUser, setPremiumUser] = useState(false);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [loginButtonPopup, setLoginButtonPopup] = useState(false);
  const [loginVisibility, setLoginVisibility] = useState("block");
  const [accountVisibility, setAccountVisibility] = useState("none");
  const [configuration, setConfiguration] = useState({});
  const [configurationDuration, setConfigurationDuration] = useState(6);
  const [open, setOpen] = useState(false);

  const isPremium = (userCookie) => {
    let config = { headers: { authorization: `Bearer ${userCookie}` } };
    axios
      .get(`http://localhost:8080/user/profile`, config)
      .then((res) => {
        setProfile(res.data);
        setPremiumUser(res.data.premium);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const readCookie = () => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(userCookie);
      setLoginVisibility(Cookies.get("loginVisibility"));
      setAccountVisibility(Cookies.get("accountVisibility"));
      isPremium(userCookie);
    }
    if (Cookies.get("productsInShoppingCart")) {
      setShoppingCart(JSON.parse(Cookies.get("productsInShoppingCart")));
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <AppContext.Provider
      value={{
        shoppingCart,
        setShoppingCart,
        user,
        setLoginButtonPopup,
        profile,
        setProfile,
        products,
        setProducts,
        premiumUser,
        setPremiumUser,
        configuration,
        setConfiguration,
        configurationDuration,
        setConfigurationDuration,
      }}
    >
      <Box>
        <ApplicationBar
          user={user}
          setUser={setUser}
          loginButtonPopup={loginButtonPopup}
          setLoginButtonPopup={setLoginButtonPopup}
          loginVisibility={loginVisibility}
          setLoginVisibility={setLoginVisibility}
          accountVisibility={accountVisibility}
          setAccountVisibility={setAccountVisibility}
          open={open}
          setOpen={setOpen}
        />

        <Stack
          className="App"
          bgcolor="#f3f3f3"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={10}
            maxWidth={1440}
          >
            <ClippedDrawer open={open} setOpen={setOpen} />
            <Routes>
              <Route strict path="/" element={<Home user={user} />} />
              <Route path="" element={<Home user={user} />} />
              <Route path="/blog" element={<Blog user={user} />} />
              <Route path="/blogarticle/:id" element={<BlogDetail user={user} />} />
              <Route path="/shop/:hardwareType" element={<FindProduct user={user} />} />
              <Route path="/about" element={<About user={user} />} />
              <Route path="/configurator" element={<Configurator user={user} />} />
              <Route path="/shoppingCart" element={<ShoppingCart user={user} />} />
              <Route path="/productDetails/:id" element={<ProductDetail user={user} />} />
              <Route path="/subscription" element={<Subscription user={user} />} />
              <Route path="/subscription/details" element={<SubscriptionDetails user={user} />} />
              <Route path="/terms" element={<Terms user={user} />} />
              <Route path="/faq" element={<Faq user={user} />} />
              <Route path="/contact" element={<Contact user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Stack>
          <Footer />
        </Stack>
      </Box>
    </AppContext.Provider>
  );
}

export default App;
