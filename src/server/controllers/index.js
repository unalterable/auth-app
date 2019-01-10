import { renderToString } from 'react-dom/server';
import App from '../../ui/Application.jsx';
import html from '../../ui/layout/basic.js';

module.exports = {
  async showIndex(req, res) {
    const title = 'Hello World Title';
    const initialState = { text: 'alice' };
    const body = renderToString(App(initialState));
    res.send(html({ title, body, initialState }));
  },
  async showData(req, res) {
    res.json({ hello: 'world' });
  },
};
