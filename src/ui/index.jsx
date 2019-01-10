import React from 'react';
import ReactDom from 'react-dom';
import Application from './Application.jsx';

ReactDom.hydrate(
  <Application { ...window.__initialState__ } />,
  document.getElementById('main-content')
);
