import React, { useState, useEffect } from "react";
import generator from "generate-maze";
import Maze from "./Maze";
import StarIcon from "@material-ui/icons/Star";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Typography, Grid, Button, IconButton } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import timer from "./timer.png";
import Menu from "./Menu";

const MyStar = styled(StarIcon)({
  color: "#FFB400",
  height: "50px",
  width: "50px",
});

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: 0,
    background: "#fff",
    minHeight: "100vh",
    overflow: "hidden",
  },
  maze: {
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 30px",
    width: "600px",
    backgroundPositionX: "200%",
  },
  info: {
    padding: "15px",
    borderRadius: "20px",
    margin: "0px 10px",
    color: "#fff",
  },
  back: {
    border: "2px solid #030303",
    borderRadius: "50%",
  },
}));

const App = (props) => {
  const classes = useStyles();
  const [mazeDimension, setMazeDimension] = useState({ height: 5, width: 5 });
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [maze, setMaze] = useState(
    generator(
      mazeDimension.height,
      mazeDimension.width,
      false,
      Math.floor(Math.random() * 34653)
    )
  );
  const [currentCell, setCurrentCell] = useState(
    maze[playerPosition.x][playerPosition.y]
  );
  const [goalPosition, setGoalPosition] = useState({
    x: mazeDimension.width - 1,
    y: mazeDimension.height - 1,
  });
  const [time, setTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [maxTime, setMaxTime] = useState(30);
  const [collectables, setCollectables] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState("");
  const [endMessage, setEndMessage] = useState("You Win!");
  const [resetToggle, setResetToggle] = useState(false);
  const [viewRange, setViewRange] = useState(-1);

  useEffect(() => {
    const classicModes = ["easy", "medium", "hard", "impossible"];
    setCurrentCell(maze[playerPosition.y][playerPosition.x]);
    if (
      playerPosition.x === goalPosition.x &&
      playerPosition.y === goalPosition.y
    ) {
      if (classicModes.includes(gameMode)) {
        setEndMessage("You Win!");
        setGameActive(false);
      } else {
        setScore(score + 1);
        updateMaxTime();
        setResetToggle(!resetToggle);
      }
    }
    let exists = collectables.find(
      (elem) => elem[0] === playerPosition.x && elem[1] === playerPosition.y
    );
    if (exists) {
      let newCollectables = collectables.filter(
        (elem) =>
          !(elem[0] === playerPosition.x && elem[1] === playerPosition.y)
      );
      console.log(newCollectables);
      setCollectables(newCollectables);
      if (gameMode === "impossible") {
        setViewRange({
          x: viewRange.x + 2,
          y: viewRange.y + 2,
        });
      } else {
        setScore(score + 1);
      }
    }
  }, [playerPosition]);

  useEffect(() => {
    let { height, width } = mazeDimension;
    if (gameMode !== "timeRush") {
      setGameActive(gameStarted ? true : false);
      setScore(0);
      if (gameMode === "easy") {
        height = width = Math.floor(Math.random() * 3 + 5);
      }
      if (gameMode === "medium") {
        console.log("medium");
        height = width = Math.floor(Math.random() * 5 + 9);
      }
      if (gameMode === "hard") {
        height = width = Math.floor(Math.random() * 4 + 14);
      }
      if (gameMode === "impossible") {
        height = width = 15;
        setTime(maxTime);
      }
    } else {
      setCollectables([]);
      setTime(maxTime);
      if (gameActive) {
        height = height === 16 ? height : height + 1;
        width = width === 16 ? width : width + 1;
      } else{
        height = width = 5;
        setScore(0);
        setGameActive(true);
      }
    }
    setMazeDimension({ height, width });
    setPlayerPosition({ x: 0, y: 0 });
    const goalPositions = [
      [width - 1, height - 1],
      [width - 1, 0],
      [0, height - 1],
    ];
    const randomGoal =
      goalPositions[
        gameMode === "impossible" ? Math.floor(Math.random() * 3) : 0
      ];
    setGoalPosition({
      x: randomGoal[0],
      y: randomGoal[1],
    });
    setTimeout(() => document.querySelector("#root").click(), 200);
  }, [resetToggle]);

  useEffect(() => {
    setMaze(
      generator(
        mazeDimension.height,
        mazeDimension.width,
        false,
        Math.floor(Math.random() * 34653)
      )
    );
    let randomPoints = gameMode === "timeRush" ? [] : generateRandomPoints(5);
    setCollectables([...randomPoints]);
  }, [mazeDimension]);

  useEffect(() => {
    if (
      time !== 0 &&
      gameActive &&
      (gameMode === "timeRush" || gameMode === "impossible")
    ) {
      const timer = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (time === 0 && (gameMode === "timeRush" || gameMode === "impossible")) {
      setEndMessage("Game Over!");
      setGameActive(false);
    }
  }, [time, gameMode]);

  useEffect(() => {
    setScore(0);
  }, [gameMode]);

  const generateRandomPoints = (num) => {
    let randomPoints = [];
    for (let i = 0; i < num; i++) {
      let exists = true;
      while (exists) {
        var px = Math.floor(Math.random() * (mazeDimension.width - 2)) + 1;
        var py = Math.floor(Math.random() * (mazeDimension.height - 2)) + 1;
        exists = randomPoints.find((elem) => elem[0] === px && elem[1] === py)
          ? true
          : false;
      }
      randomPoints.push([px, py]);
    }
    console.log(randomPoints);
    return randomPoints;
  };
  const updateMaxTime = () => {
    if (score < 10) {
      return;
    }
    if (score > 20) {
      setMaxTime(20);
      return;
    }
    if (score <= 20) {
      setMaxTime(maxTime - 1);
      return;
    }
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
    const up = ["ArrowUp", "w"];
    const down = ["ArrowDown", "s"];
    const right = ["ArrowRight", "d"];
    const left = ["ArrowLeft", "a"];
    let { x, y } = playerPosition;

    if (up.includes(event.key) && y !== 0 && !currentCell.top) {
      y -= 1;
    }
    if (
      down.includes(event.key) &&
      y !== mazeDimension.height - 1 &&
      !currentCell.bottom
    ) {
      y += 1;
    }
    if (
      right.includes(event.key) &&
      x !== mazeDimension.width - 1 &&
      !currentCell.right
    ) {
      x += 1;
    }
    if (left.includes(event.key) && x !== 0 && !currentCell.left) {
      x -= 1;
    }
    setPlayerPosition({ x, y });
  };

  const getArray = (len) => {
    let arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(1);
    }
    return arr;
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex="0"
      className={classes.root}
      id="root"
    >
      <Grid
        alignItems="center"
        justify="center"
        container
        direction="column"
        spacing={2}
        style={{ minHeight: "100vh" }}
      >
        <Grid item container direction="column" alignItems="center">
          <Typography variant="h2">
            <b>M A Z E</b>
          </Typography>
          <Typography variant="h4">A game by Kaif Kutchwala</Typography>
        </Grid>
        {gameActive && (gameMode === "timeRush" || gameMode === "impossible") && (
          <Grid item style={{ minWidth: "650px" }}>
            <Typography
              className={classes.info}
              style={{
                backgroundImage: `url(${timer})`,
                color: "#000",
                backgroundPositionX: `${100 + 100 - (100 * time) / maxTime}%`,
                backgroundRepeat: "no-repeat",
              }}
              variant="h4"
            >
              Time: <b>{time}</b>
            </Typography>
          </Grid>
        )}
        {gameActive && gameStarted && (
          <Grid item>
            <div className={classes.maze}>
              <Maze
                mazeDimension={mazeDimension}
                maze={maze}
                playerPosition={playerPosition}
                goalPosition={goalPosition}
                time={time}
                collectables={collectables}
                viewRange={viewRange}
                gameMode={gameMode}
              ></Maze>
            </div>
          </Grid>
        )}
        {!gameActive && gameStarted && (
          <Grid item style={{ minWidth: "650px" }}>
            <Grid item>
              <Grid container alignItems="center">
                {gameMode !== "timeRush" &&
                  getArray(
                    gameMode === "impossible" ? Math.floor(time / 6) : score
                  ).map((s) => {
                    return <MyStar key={s}></MyStar>;
                  })}
              </Grid>
            </Grid>
            <Typography variant="h1">{endMessage}</Typography>
            <Grid item container>
              <Button 
                onClick={() => {
                  setResetToggle(!resetToggle);
                  }}>
                <Typography variant="h4">Try Again</Typography>
              </Button>
              <Grid item>
                {!gameActive && (
                  <IconButton
                    className={classes.back}
                    onClick={() => {
                      setGameStarted(false);
                      setGameActive(false);
                    }}
                  >
                    <ArrowBackIcon></ArrowBackIcon>
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
        {!gameStarted && (
          <Grid item container direction="column" alignItems="center">
            <Typography variant="h4" style={{ margin: "10px 0px" }}>
              <b>Select a game mode</b>
            </Typography>
            <Menu
              setGameStarted={setGameStarted}
              setGameMode={setGameMode}
              setGameActive={setGameActive}
              setMazeDimension={setMazeDimension}
              setResetToggle={setResetToggle}
              resetToggle={resetToggle}
              setViewRange={setViewRange}
            />
          </Grid>
        )}
        <Grid
          item
          container
          spacing={5}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item style={{ minWidth: !gameActive ? "650px" : "" }}>
            <Typography
              className={classes.info}
              style={{ background: "#35B4C2" }}
              variant="h4"
            >
              Score: {score}
            </Typography>
          </Grid>
          <Grid item>
            {gameActive && gameStarted && (
              <IconButton
                className={classes.back}
                onClick={() => {
                  setGameStarted(false);
                  setGameActive(false);
                  setScore(0);
                }}
              >
                <ArrowBackIcon></ArrowBackIcon>
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
