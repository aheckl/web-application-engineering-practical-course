import React from "react";
import { Grid } from "@mui/material";
import ProductGridCard from "./ProductGridCard";

function ProductGrid({ products, setProducts, productType, configuratorActive }) {
  return (
    <Grid container sx={{ paddingTop: "25px" }} spacing={5}>
      {products.map((prod) => (
        <ProductGridCard product={prod} configuratorActive={configuratorActive} key={prod._id} />
      ))}
    </Grid>
  );
}

export default ProductGrid;
