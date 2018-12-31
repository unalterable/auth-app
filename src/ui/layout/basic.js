const html = ({ body, title, initialState }) => `
<!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body style="margin:0">
      <div id="main-content">${body}</div>
    </body>
    <script> window.__initialState__ = ${JSON.stringify(initialState)}</script>
    <script src="./assets/bundle.js"></script>
  </html>
`;

export default html;
