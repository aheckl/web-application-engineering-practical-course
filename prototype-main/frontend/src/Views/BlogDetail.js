import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  Checkbox,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import { ThumbUpOffAlt, ThumbUpOffAltOutlined } from "@mui/icons-material";
import Axios from "axios";
import { AppContext } from "../Context/AppContext";

function renderContents(contents) {
  return contents.map((content) => {
    if (content.heading) {
      return <Typography variant="h5">{content["heading"]}</Typography>;
    } else if (content.plainTextParagraph) {
      return (
        <Typography variant="h6" align="justify" sx={{ color: "#616161" }}>
          {content["plainTextParagraph"]}
        </Typography>
      );
    } else if (content.image) {
      return (
        <div>
          <img src={require("../static/images/blog/" + content["image"][0])} />
          <Typography sx={{ color: "black" }}>{content["image"][1]}</Typography>
        </div>
      );
    } else if (content.paragraphWithLinkAtEnd) {
      return (
        <Typography variant="h6" align="justify" sx={{ color: "#616161" }}>
          {content["paragraphWithLinkAtEnd"][0]}
          <Link to={content["paragraphWithLinkAtEnd"][2]} style={{ color: "#616161" }}>
            {content["paragraphWithLinkAtEnd"][1]}
          </Link>
        </Typography>
      );
    } else {
      return (
        <Typography variant="h6" align="justify" sx={{ color: "orange" }}>
          Unbekannter Key
        </Typography>
      );
    }
  });
}

function BlogDetail(props) {
  const location = useLocation();
  const [commentText, setCommentText] = useState("");
  let { id } = useParams();
  const [article, setArticle] = useState(
    location.state
      ? {
          text: location.state.text,
          date: location.state.date,
          author: location.state.author,
          title: location.state.title,
          image: location.state.image,
          contents: location.state.contents,
          comments: [],
        }
      : { text: "", date: "", author: "", title: "", image: "", contents: [], comments: [] }
  );

  const config = {
    headers: { Authorization: `Bearer ${props.user}` },
  };
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(location.state?.likeCount);

  const [showReplies, setShowReplies] = useState([{ _id: "62c755b8fa5a0e5ee735dafd", show: true }]);

  const { setLoginButtonPopup } = useContext(AppContext);

  useEffect(() => {
    Axios.get("http://localhost:8080/article/" + id, config).then(async (response) => {
      setArticle(response.data);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likes.length);
    });
  }, []);

  const sendComment = () => {
    let today = new Date();

    Axios.patch(
      "http://localhost:8080/article/" + id + "/addComment",
      { text: commentText, date: today },
      config
    )
      .then((response) => {
        if (response.status == 200) {
          setArticle(response.data);
          setCommentText("");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleLike = () => {
    if (props.user) {
      Axios.patch("http://localhost:8080/article/" + id + "/likeArticle", {}, config)
        .then((res) => {
          setIsLiked(res.data.isLiked);
          setLikeCount(res.data.likeCount);
        })
        .catch((err) => {
          console.log(err);
          setIsLiked(false);
        });
    } else {
      setLoginButtonPopup(true);
    }
  };
  const getReplies = (commentId) => {
    var replies = article.comments.filter((comment) => comment.replyTo == commentId);
    return replies;
  };

  return (
    <Box padding={2} flex={6}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to={"/"} style={{ color: "#616161" }} underline="hover">
            Home
          </Link>

          <Link to={"/Blog"} style={{ color: "#616161" }} underline="hover">
            Blog
          </Link>
          <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>
      </Box>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
        <Card sx={{ maxWidth: 1000 }} elevation={1}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            padding={5}
          >
            <Typography variant="h3" align="center" style={{ color: "#3D80E1" }}>
              {article.title}
            </Typography>
            {article.image != "" ? (
              <img src={require("../static/images/blog/" + article.image)} />
            ) : (
              ""
            )}
            <Typography variant="body1">Written by: {article.author}</Typography>
            <Typography variant="body1">{article.dateStr}</Typography>
            {renderContents(article.contents)}
          </Stack>

          <CardActions>
            <Checkbox
              checkedIcon={<ThumbUpOffAlt />}
              icon={<ThumbUpOffAltOutlined />}
              onClick={handleLike}
              checked={isLiked}
            />
            <Typography>{likeCount == 1 ? likeCount + " Like" : likeCount + " Likes"}</Typography>
          </CardActions>
        </Card>
      </Stack>
      <Typography paddingTop={5} paddingBottom={1} variant="h5">
        Comments
      </Typography>
      <Stack direction="row">
        <TextField
          p={10}
          label="Comment Article"
          placeholder=""
          multiline
          rows={4}
          onChange={(event) => setCommentText(event.target.value)}
          value={commentText}
          sx={{ width: 700, backgroundColor: "white" }}
        />
        <Button
          endIcon={<SendIcon />}
          onClick={() => {
            if (props.user) {
              sendComment();
            } else {
              setLoginButtonPopup(true);
            }
          }}
        >
          Send
        </Button>
      </Stack>

      <Stack spacing={1} paddingTop={3}>
        {article.comments
          .filter((comment) => !comment.replyTo)
          .reverse()
          .map((comment) => (
            <Stack spacing={1} maxWidth={700}>
              <Comment
                comment={comment}
                user={props.user}
                article={id}
                isReply={false}
                setArticle={setArticle}
                setShowReplies={setShowReplies}
                showReplies={showReplies}
                replyCount={getReplies(comment._id).length}
              />
              <Typography></Typography>
              <Collapse in={showReplies == comment._id} timeout="auto" unmountOnExit>
                <Stack spacing={1} paddingLeft={10}>
                  {getReplies(comment._id)?.map((reply) => {
                    return (
                      <Comment
                        comment={reply}
                        user={props.user}
                        article={id}
                        isReply={true}
                        repliesTo={comment.author}
                      ></Comment>
                    );
                  })}
                </Stack>
              </Collapse>
            </Stack>
          ))}
      </Stack>
    </Box>
  );
}

export default BlogDetail;
