const { raw } = require('config/raw');
const db = require('../test/helpers/db');

module.exports = {
  db: {
    mongo: {
      url: raw(db.getUrl()),
    },
  },
};
