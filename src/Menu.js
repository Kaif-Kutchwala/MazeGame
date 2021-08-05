import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  Button,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "400px",
    background: "#D7CAD8",
    height: "60px",
    margin: "5px 0px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
}));

const Menu = ({
  setGameStarted,
  setGameMode,
  setGameActive,
  resetToggle,
  setResetToggle,
  setViewRange,
  setMazeDimension,
}) => {
  const classes = useStyles();
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const dialogMessages = [
    "Classic. Get to the goal with all the collectables.",
    "You're on a time limit and the map keeps getting harder.",
    "I can't see how this is hard.",
  ];

  const setMode = (mode) => {
    setGameStarted(true);
    setGameActive(true);
    setGameMode(mode);
    setResetToggle(!resetToggle);
    if (mode === "impossible") {
      setViewRange({
        x: 2,
        y: 2,
      });
    } else {
      setViewRange({
        x: 30,
        y: 30,
      });
    }
    if (mode === "timeRush") {
      setMazeDimension({
        height: 5,
        width: 5,
      });
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  return (
    <Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <Button
              onClick={() => setMode("easy")}
              className={classes.button}
              style={{ width: "130px", marginRight: "5px" }}
              size="large"
            >
              Easy
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setMode("medium")}
              className={classes.button}
              style={{ width: "130px", marginRight: "5px" }}
              size="large"
            >
              Medium
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setMode("hard")}
              className={classes.button}
              style={{ width: "130px", marginRight: "0px" }}
              size="large"
            >
              Hard
            </Button>
          </Grid>
          <Grid item>
            <IconButton
              size="medium"
              onClick={() => handleOpen(dialogMessages[0])}
            >
              <HelpIcon></HelpIcon>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <Button
              onClick={() => setMode("timeRush")}
              className={classes.button}
              size="large"
            >
              Time Rush
            </Button>
          </Grid>
          <Grid item>
            <IconButton
              size="medium"
              onClick={() => handleOpen(dialogMessages[1])}
            >
              <HelpIcon></HelpIcon>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <Button
              onClick={() => setMode("impossible")}
              className={classes.button}
              size="large"
            >
              Impossible Mode
            </Button>
          </Grid>
          <Grid item>
            <IconButton
              size="medium"
              onClick={() => handleOpen(dialogMessages[2])}
            >
              <HelpIcon></HelpIcon>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} keepMounted onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h3" align="center">
              {dialogMessage}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Menu;
