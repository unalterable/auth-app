import React from 'react';
import ReactDom from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import { BrowserRouter } from 'react-router-dom';
import Application from './Application.jsx';

ReactDom.hydrate(
  <JssProvider>
    <BrowserRouter>
      <Application {...window.__initialState__} />
    </BrowserRouter>
  </ JssProvider>,
  document.getElementById('main-content')
);
