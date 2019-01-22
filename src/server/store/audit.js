const uuidv4 = require('uuid/v4');

module.exports = ({ getCollection }) => {
  const getAudit = () => getCollection('audit');

  return {
    insert: item => getAudit()
      .then(audit => audit
        .insertOne({ ...item, id: uuidv4() })),
  };
};
