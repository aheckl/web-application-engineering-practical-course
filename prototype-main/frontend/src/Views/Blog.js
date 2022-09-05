import { Box, Breadcrumbs, Grid, Link, Typography } from "@mui/material";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import BlogGridCard from "../components/GridCards/BlogGridCard";

function Blog({ user }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/article").then((response) => {
      setArticles(response.data);
    });
  }, []);

  return (
    <Box flex={1}>
      <Box paddingTop={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Blog</Typography>
        </Breadcrumbs>
      </Box>
      <Box padding={2} flex={6}>
        <Typography variant="h3" align="center" style={{ color: "#3D80E1" }}>
          Tech-Blog
        </Typography>

        <Grid paddingTop={2} container spacing={8} align="center">
          {articles.map((article) => (
            <BlogGridCard card={article} user={user} key={article._id} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Blog;
