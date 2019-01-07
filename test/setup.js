const prepare = require('mocha-prepare');
const { container: mongo } = require('./helpers/db');

const testWrapper = (() => {
  let usingExistingMongo;

  return {
    setup: async () => {
      usingExistingMongo = mongo.ensureRunning().wasAlreadyRunning;
      /* await startServer(); */
    },
    tearDown: async () => {
      /* await stopServer(), */
      usingExistingMongo ? console.info('Not removing container as it was already running') : mongo.stopAndRemove();
    },
  };
})();

prepare(
  (done) => { return testWrapper.setup().then(done, done) },
  (done) => { return testWrapper.tearDown().then(done, done) },
);
