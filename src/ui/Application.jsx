import React from 'react';
import Theme from './Theme.jsx';
import TopNav from './components/TopNav.jsx';

const Application = ({ text }) => {
  return (
    <Theme>
      <TopNav />
      <div>
        <p>Hello World!</p>
        <p onClick={async () => {
          console.info('JS working');
          await new Promise(res => setTimeout(res, 2000));
          console.info('JS working');
        }}>{text}</p>
      </div>
    </Theme>
  );
};

export default Application;
