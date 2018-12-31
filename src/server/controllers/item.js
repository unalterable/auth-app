const initItemController = ({ itemStore }) => {
  const getItems = async (req, res) => {
    try {
      const allitems = await itemStore.getAll();
      res.send(allitems);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  };

  const createItem = async (req, res) => {
    try {
      const newItem = req.body;
      const updatedItemList = await itemStore.insert(newItem);
      res.status(201).send(updatedItemList);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  };

  const getItemById = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await itemStore.getById(id);
      res.send(item);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  };

  const updateItemById = async (req, res) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const item = await itemStore.updateById(id, changes);
      res.send(item);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  };

  const deleteItemById = async (req, res) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      await itemStore.deleteById(id, changes);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  };

  return {
    getItems,
    createItem,
    getItemById,
    updateItemById,
    deleteItemById,
  };
};

module.exports = initItemController;
