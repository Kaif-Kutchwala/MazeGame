import React from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";

const MyFlag = styled(FlagIcon)({
  color: "#DB6A81",
});

const useStyles = makeStyles((theme) => ({
  cell: {
    height: "40px",
    width: "40px",
    boxSizing: "border-box",
    background: "#fff",
  },
  coveredCell: {
    height: "40px",
    width: "40px",
    boxSizing: "border-box",
    background: "#fff",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  player: {
    height: "35px",
    width: "35px",
    borderRadius: "50%",
    background: "#2F5E9F",
    boxShadow: "5 5",
  },
  collectable: {
    backgroundColor: "#D8CBD9",
  },
}));

const Maze = ({
  playerPosition,
  maze,
  goalPosition,
  mazeDimension,
  collectables,
  viewRange,
  gameMode,
}) => {
  const classes = useStyles();
  const cellHeight = 600 / mazeDimension.height;
  const cellWidth = 600 / mazeDimension.width;
  const getBorders = (cell) => {
    let style = {
      height: cellHeight.toString() + "px",
      width: cellWidth.toString() + "px",
    };
    const border = "3px solid #353434";
    Object.keys(cell)
      .slice(1, -1)
      .forEach((property) => {
        if (cell[property]) {
          style[
            "border" + property.charAt(0).toUpperCase() + property.slice(1)
          ] = border;
        }
      });
    return style;
  };

  const checkInViewRange = (x, y) => {
    if (gameMode === "impossible") {
      const maxX = playerPosition.x + viewRange.x / 2;
      const minX = playerPosition.x - viewRange.x / 2;
      const maxY = playerPosition.y + viewRange.y / 2;
      const minY = playerPosition.y - viewRange.y / 2;
      if (y <= maxY && y >= minY && x >= minX && x <= maxX) {
        return true;
      }
      return false;
    }
    return true;
  };
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid xs item align="center">
        {maze.map((row, rowId) => {
          return (
            <Grid className={classes.row} key={rowId}>
              {row.map((cell, cellId) => {
                return (
                  <Grid
                    className={
                      checkInViewRange(cellId, rowId)
                        ? classes.cell
                        : classes.coveredCell
                    }
                    style={
                      checkInViewRange(cellId, rowId) ? getBorders(cell) : {}
                    }
                    alignItems="center"
                    container
                    justifyContent="center"
                    key={cellId}
                  >
                    {playerPosition.y === rowId &&
                    playerPosition.x === cellId ? (
                      <Grid item className={classes.player}></Grid>
                    ) : checkInViewRange(cellId, rowId) &&
                      goalPosition.y === rowId &&
                      goalPosition.x === cellId ? (
                      <MyFlag fontSize="large"> </MyFlag>
                    ) : collectables.find(
                        (elem) => elem[0] === cellId && elem[1] === rowId
                      ) && checkInViewRange(cellId, rowId) ? (
                      <Grid
                        item
                        className={classes.collectable}
                        style={{
                          height:
                            Math.min(cellHeight - 10, 30).toString() + "px",
                          width: Math.min(cellWidth - 10, 30).toString() + "px",
                        }}
                      ></Grid>
                    ) : (
                      <></>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Maze;
