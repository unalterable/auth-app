import React from 'react';
import Theme from './Theme.jsx';
import TopNav from './components/TopNav.jsx';
import SignIn from './components/SignIn.jsx';

const Application = ({ text }) => {
  return (
    <Theme>
      <TopNav />
      <SignIn />
    </Theme>
  );
};

export default Application;
