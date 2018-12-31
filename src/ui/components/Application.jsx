import React from 'react';

const Application = ({ text }) => {
  return (
    <div>
      <p>Hello World!</p>
      <p onClick={() => console.log('JS working')}>{text}</p>
    </div>
  );
};

export default Application;
