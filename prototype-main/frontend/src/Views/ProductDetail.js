import { Box, Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";
import ImageSlider from "../components/singleProdViewComps/ImageSlider";
import ProductDescription from "../components/singleProdViewComps/ProductDescription";
import ProductOptions from "../components/singleProdViewComps/ProductOptions";

const defaultImage1 = "available-soon-blue.jpg";
const defaultImage2 = "available-soon-grey.jpg";
let defaultImages = [defaultImage1, defaultImage2];

const ProductDetail = ({ user }) => {
  let navigate = useNavigate();
  let { id } = useParams();
  const location = useLocation();
  const configuratorActive = location.state?.configuratorActive;
  const [product, setProduct] = useState(location.state);

  useEffect(() => {
    Axios.get(`http://localhost:8080/part/getbyid/${product ? product._id : id}`).then((result) => {
      setProduct(result.data);
    });
  }, []);

  useEffect(() => {
    Axios.get(
      `http://localhost:8080/part/getbyid/${location.state ? location.state._id : id}`
    ).then((result) => {
      setProduct(result.data);
    });
  }, [location]);

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
        return type;
    }
  };

  return (
    <Box flex={6} paddingLeft={1} paddingRight={1}>
      {/* Breadcrumbs */}
      <Box paddingTop={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          {configuratorActive ? (
            <Link underline="hover" color="inherit" onClick={() => navigate("/Configurator")}>
              Configurator
            </Link>
          ) : (
            ""
          )}
          <Link
            underline="hover"
            color="inherit"
            onClick={() =>
              navigate("/shop/" + product?.type, {
                state: { configuratorActive: configuratorActive },
              })
            }
          >
            {getBreadCrumbText(product?.type)}
          </Link>
          <Typography color="inherit">{product?.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Stack
        direction="row"
        spacing={5}
        paddingBottom={5}
        justifyContent="flex-start"
        alignItems="flex-start"
        paddingTop={5}
      >
        <Box maxWidth={"60%"}>
          <ImageSlider
            slides={product?.detailImages ? product?.detailImages : defaultImages}
            type={product?.type}
          />
          <ProductDescription product={product} configuratorActive={configuratorActive} />
        </Box>
        <ProductOptions
          product={product}
          setProduct={setProduct}
          configuratorActive={configuratorActive}
          user={user}
        />
      </Stack>
    </Box>
  );
};

export default ProductDetail;
