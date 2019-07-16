/**
 * @description 函数式组件 返回一个 paper
 */
import React from "react";

import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

const styles = {
  root: {
    margin: 18,
    marginTop: 75
  }
};

const Container = ({ classes, children }) => (
  <Paper elevation={4} className={classes.root}>
    {children}
  </Paper>
);

export default withStyles(styles)(Container);
