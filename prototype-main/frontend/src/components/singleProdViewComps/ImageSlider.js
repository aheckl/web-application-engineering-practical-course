import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import { ImageList } from "@mui/material";
import { ImageListItem } from "@mui/material";
import { Card, CardActionArea, CardMedia } from "@mui/material";

const ImageSlider = ({ slides, type }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <Stack flex={1} alignItems="flex-start" justifyContent="center">
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="center" flex={1}>
          <IconButton onClick={prevSlide}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Box maxWidth={600}>
            {slides.map((slide, index) => {
              return (
                <Box className={index === current ? "slide active" : "slide"} key={index}>
                  {index === current && (
                    <Card sx={{ padding: 5 }}>
                      <CardActionArea>
                        {type ? (
                          <CardMedia
                            component="img"
                            image={require("../../static/images/productDetails/" +
                              type +
                              "/" +
                              slide)}
                            alt="CardPic"
                          />
                        ) : (
                          ""
                        )}
                      </CardActionArea>
                    </Card>
                  )}
                </Box>
              );
            })}
          </Box>
          <IconButton onClick={nextSlide}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Box>
      <Box paddingLeft={5}>
        <ImageList cols={5}>
          {slides.map((slide, index) => (
            <ImageListItem
              //#3D80E1
              sx={
                index == current
                  ? { maxWidth: 200, border: "2px solid lightgrey" }
                  : { maxWidth: 200 }
              }
              key={slide}
              onClick={() => {
                setCurrent(index);
              }}
            >
              <img
                src={require("../../static/images/productDetails/" +
                  (type ? type + "/" : "") +
                  slide)}
                srcSet={require("../../static/images/productDetails/" +
                  (type ? type + "/" : "") +
                  slide)}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Stack>
  );
};

export default ImageSlider;
