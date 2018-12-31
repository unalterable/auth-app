const uuidv4 = require('uuid/v4');
const _  = require('lodash');

const sanitiseItem = item => _.omit(item, '_id');
const projection = { _id: 0 };

module.exports = ({ getCollection }) => {
  const getItems = () => getCollection('account');
  return {
    insert: item => getItems()
      .then(collection => collection
        .insertOne({ ...item, id: uuidv4() }))
      .then(result => sanitiseItem(result.ops[0])),
    getByName: name => getItems()
      .then(collection => collection
        .findOne({ name }, { projection })),
    updateById: (id, changes) => getItems()
      .then(collection => collection
        .findOneAndUpdate({ id }, { $set: _.omit(changes, ['id']) }, { projection, returnOriginal: false }))
      .then(result => sanitiseItem(result.value)),
  };
};
