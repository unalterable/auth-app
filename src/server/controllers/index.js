import React from 'react';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import Application from '../../ui/Application.jsx';
import html from '../../ui/layout/basic.js';

const title = 'Authentication';

module.exports = {
  async showIndex(req, res) {
    const initialState = {};
    const sheetsRegistry = new SheetsRegistry();
    const body = renderToString(
      <JssProvider registry={sheetsRegistry} >
        <Application {...initialState} />
      </ JssProvider>
    );
    res.send(html({ title, body, initialState, css: sheetsRegistry.toString() }));
  },
};
