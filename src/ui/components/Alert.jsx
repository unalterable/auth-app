import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[500],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: blue[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: { fontSize: 20 },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Alert = ({ classes, message, variant, open, onClose, vertical = 'top', horizontal = 'center' }) => {
  const Icon = variantIcon[variant];
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes[variant]}
        message={
          <span className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            <Typography variant="h6" color="inherit">
              {message}
            </Typography>
          </span>
        }
      />
    </Snackbar>
  );
};

export default withStyles(styles)(Alert);
