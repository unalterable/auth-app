import React from 'react';
import Theme from './Theme.jsx';
import TopNav from './components/TopNav.jsx';
import SignIn from './components/SignIn.jsx';

class Application extends React.Component {
  render() {
    return (
      <Theme>
        <TopNav />
        <SignIn />
      </Theme>
    );
  }
}

export default Application;
