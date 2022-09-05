import { Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductFilter from "../components/Filter/ProductFilter";
import ProductGrid from "../components/findProduct/ProductGrid";

const FindProduct = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const configuratorActive = location.state ? location.state.configuratorActive : false;
  let { hardwareType } = useParams();
  const [products, setProducts] = useState([]);
  const [productType, setProductType] = useState(hardwareType);

  useEffect(() => {
    setProductType(hardwareType);
  });

  const getBreadCrumbText = (type) => {
    switch (type) {
      case "gpu":
        return "Graphics Cards";
      case "cpu":
        return "Processors";
      case "ram":
        return "Memory";
      case "case":
        return "Cases";
      case "mainboard":
        return "Mainboards";
      case "drive":
        return "Drives";
      case "secondHand":
        return "Second Hand Deals";
      default:
        return hardwareType;
    }
  };
  return (
    <Box flex={6}>
      <Box paddingTop={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          {configuratorActive ? (
            <Link underline="hover" color="inherit" onClick={() => navigate("/configurator")}>
              Configurator
            </Link>
          ) : (
            ""
          )}
          <Typography color="text.primary">{getBreadCrumbText(hardwareType)}</Typography>
        </Breadcrumbs>
      </Box>
      <Typography variant="h4" paddingTop={2} paddingBottom={2}>
        {configuratorActive
          ? "Browse " + getBreadCrumbText(hardwareType) + " for your Configuration"
          : "Browse for " + getBreadCrumbText(hardwareType)}
      </Typography>
      {/* //bgcolor={"#f7faf8"} */}
      <Box bgcolor={"white"}>
        <ProductFilter products={products} setProducts={setProducts} productType={productType} />
      </Box>
      <Stack paddingTop={3}>
        <Typography variant="body2">{products.length} Results</Typography>
      </Stack>
      <ProductGrid
        products={products}
        setProducts={setProducts}
        productType={productType}
        configuratorActive={configuratorActive}
      ></ProductGrid>
    </Box>
  );
};

export default FindProduct;
