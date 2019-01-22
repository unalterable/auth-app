import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
});


class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = { profile: null };
    axios.get('/auth/api/profile').then(({ data }) => {
      this.setState({ profile: data });
    });
  }

  render () {
    if (!this.state.profile) return (<div>loading</div>);

    return (
      <Paper>
        {JSON.stringify(this.state.profile, null, 2)}
      </Paper>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
