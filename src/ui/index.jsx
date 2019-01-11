import React from 'react';
import ReactDom from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import Application from './Application.jsx';

ReactDom.hydrate(
  <JssProvider>
    <Application { ...window.__initialState__ } />
  </ JssProvider>
  ,
  document.getElementById('main-content')
);
