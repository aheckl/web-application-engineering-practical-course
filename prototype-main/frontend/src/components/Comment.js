import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

function Comment(props) {
  const comment = props.comment;
  const [replyActive, setReplyActive] = useState(false);
  const [answer, setAnswer] = useState("");
  const config = {
    headers: { Authorization: `Bearer ${props.user}` },
  };
  const { setLoginButtonPopup } = useContext(AppContext);

  const sendComment = () => {
    if (props.user != null) {
      let today = new Date();

      Axios.patch(
        "http://localhost:8080/article/" + props.article + "/addComment",
        { text: answer, date: today, replyTo: comment._id },
        config
      )
        .then((response) => {
          if (response.status == 200) {
            props.setArticle(response.data);
            setAnswer("");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setLoginButtonPopup(true);
    }
  };

  return (
    <Stack spacing={2}>
      <Card flex={4}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
              {comment.author.charAt(0)}
            </Avatar>
          }
          title={comment.author}
          subheader={comment.date.slice(0, 10)}
        />
        <CardContent>
          <Typography> {props.isReply ? "@" + props.repliesTo : ""}</Typography>
          <Typography component={"span"} variant="body2" color="text.secondary">
            <ReactMarkdown>{comment.text}</ReactMarkdown>
          </Typography>
        </CardContent>
        <CardActions>
          {!props.isReply ? (
            <IconButton
              onClick={() => {
                props.setShowReplies(comment._id == props.showReplies ? "" : comment._id);
              }}
            >
              <ReplyIcon />{" "}
              {props.replyCount > 0 ? (
                <Typography variant="body2"> show {props.replyCount} replies </Typography>
              ) : (
                ""
              )}
            </IconButton>
          ) : (
            ""
          )}
        </CardActions>
      </Card>
      {props.showReplies == comment._id ? (
        <Stack direction="row" paddingLeft={10}>
          <TextField
            p={10}
            id="outlined-textarea"
            label="Reply to Comment"
            placeholder=""
            multiline
            onChange={(event) => setAnswer(event.target.value)}
            value={answer}
            sx={{ width: 600, backgroundColor: "white" }}
          />
          <Button endIcon={<SendIcon />} onClick={sendComment}>
            Send
          </Button>
        </Stack>
      ) : (
        ""
      )}
    </Stack>
  );
}

export default Comment;
