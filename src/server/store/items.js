const uuidv4 = require('uuid/v4');
const _  = require('lodash');

const sanitiseItem = item => _.omit(item, '_id');
const projection = { _id: 0 };

module.exports = ({ getCollection }) => {
  const getItems = () => getCollection('items');
  return {
    getAll: () => getItems()
      .then(collection => collection
        .find({}).project({ _id: 0 }).toArray()),
    getById: id => getItems()
      .then(collection => collection
        .findOne({ id }, { projection })),
    insert: item => getItems()
      .then(collection => collection
        .insertOne({ ...item, id: uuidv4() }))
      .then(result => sanitiseItem(result.ops[0])),
    updateById: (id, changes) => getItems()
      .then(collection => collection
        .findOneAndUpdate({ id }, { $set: _.omit(changes, ['id']) }, { projection, returnOriginal: false }))
      .then(result => sanitiseItem(result.value)),
    deleteById: id => getItems()
      .then(collection => collection.
        deleteOne({ id })),
  };
};
