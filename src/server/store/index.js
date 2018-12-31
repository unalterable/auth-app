const { MongoClient } = require('mongodb');
const config = require('config');
const initItemsCollection = require('./items');

const dbName = config.get('db.mongo.dbName');

const getConnection = (connectionAttempt => () => {
  if (!connectionAttempt) {
    connectionAttempt = Promise.resolve()
      .then(() => config.get('db.mongo.url'))
      .then(url => MongoClient.connect(url, { useNewUrlParser: true, autoReconnect: false }))
      .then(conn => {
        console.info('Mongo connection established');
        conn.on('close', () => {
          console.info('Mongo connection terminated');
          connectionAttempt = null;
        });
        return conn;
      })
      .catch((err) => {
        connectionAttempt = null;
        throw Error(`Mongo connection failed: ${err.message}`);
      });
  }
  return connectionAttempt;
})(null);

const initStore = () => {
  const getCollection = (collectionName) => getConnection()
    .then(connection => connection.db(dbName).collection(collectionName));

  return {
    getConnection,
    collections: {
      items: initItemsCollection({ getCollection }),
    },
  };
};

module.exports = initStore;
