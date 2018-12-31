const dockerStarter = require('docker-starter');
const { MongoClient } = require('mongodb');

const mongo = dockerStarter({
  container: 'db-test',
  image: 'mongo:4.0.4',
  extraOptions: '--restart on-failure:5',
  containerPort: 27017,
  publishedPort: 27019,
});


const getUrl = (url => async () => {
  if (!url) {
    const { host, port } = mongo.ensureRunning();
    url = `mongodb://${host}:${port}`;
  }
  return url;
})(null);

module.exports = {
  getUrl,
  collectionTools: async ({ db, collection }) => ({
    getAll: async () => {
      const connection = await MongoClient.connect(await getUrl(), { useNewUrlParser: true });
      const result = await connection.db(db).collection(collection).find({}).toArray();
      connection.close();
      return result;
    },
    insertMany: async (items) => {
      const connection = await MongoClient.connect(await getUrl(), { useNewUrlParser: true });
      await connection.db(db).collection(collection).insertMany(items);
      connection.close();
    },
    removeAll: async () => {
      const connection = await MongoClient.connect(await getUrl(), { useNewUrlParser: true });
      await connection.db(db).collection(collection).deleteMany({});
      connection.close();
    },
  }),
};
