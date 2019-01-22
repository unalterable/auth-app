import React from 'react';
import Route from 'react-router-dom/Route';
import Theme from './Theme.jsx';
import TopNav from './components/TopNav.jsx';
import SignIn from './components/SignIn.jsx';
import Profile from './components/Profile.jsx';

class Application extends React.Component {
  render() {
    return (
      <Theme>
        <TopNav />
        <Route path='/auth' exact component={SignIn}/>
        <Route path='/auth/profile' exact component={Profile}/>
      </Theme>
    );
  }
}

export default Application;
