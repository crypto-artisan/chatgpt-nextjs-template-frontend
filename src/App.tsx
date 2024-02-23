// import Container from "@mui/material/Container";
import Header from "./Header";
import {
  Box,
  Stack,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
// import ListItemText from "@mui/material/ListItemText";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
// import Sidebar from "./Sidebar";

interface Message {
  id: number;
  text: string;
  sender: string;
}

export default function Blog() {
  // const [selectedIndex, setSelectedIndex] = useState(1);
  const [prompt, setPrompt] = useState<string>("");
  const [prompt1, setPrompt1] = useState<string>("");
  const [prompt2, setPrompt2] = useState<string>("");
  const [prompt3, setPrompt3] = useState<string>("");
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [response, setResponse] = useState("");
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
    if (e?.key !== "Enter") {
      return;
    }
    if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
      setPrompt(`pi will be giving you a transcript of a process i am looking to document.
        The process is ${prompt1}.
        But i want you to read and follow the instructions that i will send first.
        Are you ready?
         + "\n"`);
      // return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      setPrompt(`i will be giving you a transcript of a process i am looking to document.
      The process is ${prompt1}.
      But i want you to read and follow the instructions that i will send first.
      Are you ready?`);
      console.log(prompt);
      // if (!loading) sendPrompt();
    }
  };
  useEffect(()=>{
    setPrompt(`i will be giving you a transcript of a process i am looking to document.
      The process is ${prompt1}.
      But i want you to read and follow the instructions that i will send first.
      Are you ready?`);
  },[prompt1, prompt2, prompt3])
  const sendPrompt = async () => {
    setLoading(true);
    // setErrorMessage("");

    if (prompt.trim() == "") {
      console.log("prompt is empty");
      return;
    }

    console.log("-----prompt-------", prompt);
    let num = 0;
    if (messages != null) {
      num = messages?.length;
      setMessages([...messages, { id: num, text: prompt, sender: "user" }]);
    } else {
      num = 0;
      setMessages([{ id: 0, text: prompt, sender: "user" }]);
    }

    await fetch("http://localhost:5050/api/proprietary-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => {
        console.log("response--------", response);
        return response.json();
      })
      .then((data) => {
        console.log("Result", data.result);

        setResponse(data.result);
        // setOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Network Error! Please try again.");
      });
    setLoading(false);
  };

  useEffect(() => {
    setPrompt("");
    if (messages != null)
      setMessages([
        ...messages,
        { id: messages.length, text: response, sender: "bot" },
      ]);
  }, [response]);

  useEffect(() => {
    setPrompt("");
    if (messages != null && errorMessage != "") {
      setMessages([
        ...messages,
        { id: messages.length, text: errorMessage, sender: "bot" },
      ]);
      setErrorMessage("");
    }
  }, [errorMessage]);

  console.log("Message-------", messages);
  const Message = ({ message }: { message: Message }) => {
    return (
      <>
        <Stack direction={"row"} spacing={2} color={"white"}>
          {message.sender == "user" ? (
            <AccountBoxIcon />
          ) : (
            <DesktopWindowsIcon />
          )}
          <Box sx={{ wordWrap: "break-word", width: "95%" }}>
            {message.text}
          </Box>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10vh",
          height: "calc(90vh)",
          paddingY: 5,
          paddingX: 5,
        }}
      >
        <Header />
        <Stack
          direction="row"
          spacing={10}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: "70%",
              // border: 2,
              borderColor: "#66BB6A",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                // mt: "-50px",
                mb: 2,
                p: 2,
                maxWidth: "90%",
                width: "90%",
                mx: "auto",
                "&::-webkit-scrollbar": {
                  width: "12px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#e1e1e1",
                  borderRadius: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#66BB6A",
                  borderRadius: "6px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#6C5E8D",
                },
              }}
            >
              {messages == null && (
                <>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      color: "#2F684D",
                      fontSize: "4rem",
                      fontWeight: "bold",
                    }}
                  >
                    Welcome to
                  </Typography>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      color: "#2F684D",
                      fontSize: "4rem",
                      fontWeight: "bold",
                    }}
                  >
                    my simple project!
                  </Typography>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      color: "#2F684D",
                      // fontSize: "6rem",
                      fontWeight: "bold",
                    }}
                  >
                    This project is implemented on your job description
                  </Typography>
                </>
              )}
              {messages?.map((message) => (
                <>
                  <Message key={message.id} message={message} />
                  <Divider
                    sx={{
                      my: 2,
                      width: "80%",
                      mx: "auto",
                      borderColor: "#2F684D",
                    }}
                  />
                </>
              ))}
            </Box>
            <Box sx={{ color: "white", width: "75%", mx: "auto" }}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    sx={{
                      "& textarea": {
                        // Or if single line, "& input"
                        color: "white", // Customizing the text color of the input
                      },
                    }}
                    InputProps={{
                      sx: {
                        "& svg": {
                          fill: "#66BB6A",
                        },
                        "& fieldset": {
                          border: "2px solid #66BB6A!important",
                          borderRadius: 2,
                        },
                        "&:hover fieldset": {
                          // border: "2px solid #66BB6A!important",
                          // borderRadius: 0,
                        },
                        "&:focus-within fieldset, &:focus-visible fieldset": {
                          boxShadow: "0px 0px 16px 0px #66BB6A",
                        },
                      },
                    }}
                    placeholder="What type of process are you looking to document?"
                    value={prompt1}
                    onChange={(e) => setPrompt1(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    sx={{
                      "& textarea": {
                        // Or if single line, "& input"
                        color: "white", // Customizing the text color of the input
                      },
                    }}
                    InputProps={{
                      sx: {
                        "& svg": {
                          fill: "#66BB6A",
                        },
                        "& fieldset": {
                          border: "2px solid #66BB6A!important",
                          borderRadius: 2,
                        },
                        "&:hover fieldset": {
                          // border: "2px solid #66BB6A!important",
                          // borderRadius: 0,
                        },
                        "&:focus-within fieldset, &:focus-visible fieldset": {
                          boxShadow: "0px 0px 16px 0px #66BB6A",
                        },
                      },
                    }}
                    placeholder="How many people are in the transcript?"
                    value={prompt2}
                    onChange={(e) => setPrompt2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    sx={{
                      "& textarea": {
                        // Or if single line, "& input"
                        color: "white", // Customizing the text color of the input
                      },
                    }}
                    InputProps={{
                      sx: {
                        "& svg": {
                          fill: "#66BB6A",
                        },
                        "& fieldset": {
                          border: "2px solid #66BB6A!important",
                          borderRadius: 2,
                        },
                        "&:hover fieldset": {
                          // border: "2px solid #66BB6A!important",
                          // borderRadius: 0,
                        },
                        "&:focus-within fieldset, &:focus-visible fieldset": {
                          boxShadow: "0px 0px 16px 0px #66BB6A",
                        },
                      },
                    }}
                    placeholder="Please copy and paste your transcript below:"
                    value={prompt3}
                    onChange={(e) => setPrompt3(e.target.value)}
                    onKeyDown={handleEnter}
                  />
                </Grid>
              </Grid>

            </Box>
            <Box sx={{ color: "white", width: "75%", mx: "auto", paddingY: 5 }}>
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", alignItems: "flex-end", flexDirection: "column-reverse" }}
              >
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="success"
                    title="Send"
                    sx={{
                      borderRadius: "50%",
                      width: "45px",
                      height: "64px",
                      "&.Mui-disabled": {
                        backgroundColor: "#2F684D", // Custom background color when button is disabled
                        color: "white", // Custom text color when button is disabled
                      },
                    }}
                    onClick={sendPrompt}
                    disabled={loading}
                  >
                    {/* <SendIcon /> */}
                    {loading ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      <SendIcon />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ color: "white", width: "75%", mx: "auto" }}>
              Hidden Prompt: {prompt}
            </Box>
            <Box sx={{ color: "white", width: "75%", mx: "auto" }}>
              Input1: {prompt1}
            </Box>
            <Box sx={{ color: "white", width: "75%", mx: "auto" }}>
              Input2: {prompt2}
            </Box>
            <Box sx={{ color: "white", width: "75%", mx: "auto" }}>
              Input3: {prompt3}
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
