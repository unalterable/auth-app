import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Route path='/auth/profile' exact component={() => (
            <Button color="inherit" component={props => <a href="/spending-analysis/" {...props} />}>Spending Analysis</Button>
          )}/>
          <Typography variant="h6" color="inherit" className={classes.grow}>
          </Typography>
          <IconButton className={classes.menuButton} color="inherit">
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
