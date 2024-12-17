const {
  getAllItemMovements,
  getAllProductsAlphabetically,
  getAllStores,
  getStoreItems,
  addItemToInventory,
  insertIntoItemMovements,
  removeItemFromInventory,
  incrementStoreItems,
  decrementStoreItems,
} = require("../db/db_utilities");

const getAllItemActivity = async (req, res) => {
  const itemMovements = await getAllItemMovements();
  const search = req.query.search || "";
  // console.log(search);
  const filteredItemMovements = itemMovements.filter((itemMovement) =>
    itemMovement.item_name.toLowerCase().includes(search.toLowerCase())
  );
  res.render("itemMovements/itemMovements", {
    itemMovements: filteredItemMovements,
    search,
  });
};

const getNewItemMovementForm = async (req, res) => {
  const products = await getAllProductsAlphabetically();
  const stores = await getAllStores();

  // for each store, get the store items
  const storeItems = await Promise.all(
    stores.map(async (store) => {
      return { ...store, items: await getStoreItems(store.id) };
    })
  );
  res.render("itemMovements/getNewItemMovementForm", {
    products,
    stores,
    storeItems,
  });
};

const addNewItemMovement = async (req, res) => {
  let { movementType, fromStore, toStore, itemId, quantity, description } =
    req.body;

  const fromStoreId = parseInt(fromStore);
  const toStoreId = parseInt(toStore);
  itemId = parseInt(itemId);
  quantity = parseInt(quantity);

  if (movementType === "add" && toStoreId === 9) {
    // add to inventory
    const addToInventory = await addItemToInventory(itemId, quantity);

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      null,
      toStoreId,
      quantity,
      "add",
      "Added to inventory"
    );

    // console.log(addToInventory);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  if (movementType === "remove" && fromStoreId === 9) {
    // remove from inventory
    const removeFromInventory = await removeItemFromInventory(itemId, quantity);

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      fromStoreId,
      null,
      quantity,
      "remove",
      `Removed from inventory`
    );

    // console.log(removeFromInventory);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  // if the movement type is add and the to store is not 9,
  if (movementType === "add" && toStoreId !== 9) {
    // add to inventory
    const addToInventory = await incrementStoreItems(
      toStoreId,
      itemId,
      quantity
    );

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      null,
      toStoreId,
      quantity,
      "add",
      description
    );

    // console.log(addToInventory);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  // if the movement type is remove and the from store is not 9,
  if (movementType === "remove" && fromStoreId !== 9) {
    // remove from inventory
    const removeFromInventory = await decrementStoreItems(
      fromStoreId,
      itemId,
      quantity
    );

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      fromStoreId,
      null,
      quantity,
      "remove",
      description
    );

    // console.log(removeFromInventory);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  if (
    movementType === "transfer" &&
    fromStoreId !== 9 &&
    toStoreId !== 9 &&
    fromStoreId !== toStoreId
  ) {
    // transfer from one store to another
    const transferFromStore = await decrementStoreItems(
      fromStoreId,
      itemId,
      quantity
    );
    const transferToStore = await incrementStoreItems(
      toStoreId,
      itemId,
      quantity
    );

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      fromStoreId,
      toStoreId,
      quantity,
      "transfer",
      description
    );

    // console.log(transferFromStore);
    // console.log(transferToStore);
    // console.log("success");
    res.redirect("/item-movements");
  }
  if (movementType === "transfer" && fromStoreId === 9 && toStoreId !== 9) {
    // transfer from inventory to a store
    const transferFromInventory = await removeItemFromInventory(
      itemId,
      quantity
    );
    const transferToStore = await incrementStoreItems(
      toStoreId,
      itemId,
      quantity
    );

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      fromStoreId,
      toStoreId,
      quantity,
      "transfer",
      description
    );

    // console.log(transferFromInventory);
    // console.log(transferToStore);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  if (movementType === "transfer" && fromStoreId !== 9 && toStoreId === 9) {
    // transfer from a store to inventory
    const transferFromStore = await decrementStoreItems(
      fromStoreId,
      itemId,
      quantity
    );
    const transferToInventory = await addItemToInventory(itemId, quantity);

    // insert into item movements
    const insertToItemMovements = await insertIntoItemMovements(
      itemId,
      fromStoreId,
      toStoreId,
      quantity,
      "transfer",
      description
    );

    // console.log(transferFromStore);
    // console.log(transferToInventory);
    // console.log(insertToItemMovements);
    // console.log("success");
    res.redirect("/item-movements");
  }

  if (movementType === "transfer" && fromStoreId === toStoreId) {
    res.status(400).send("From and to store cannot be the same");
  }
};

module.exports = {
  getAllItemActivity,
  getNewItemMovementForm,
  addNewItemMovement,
};
