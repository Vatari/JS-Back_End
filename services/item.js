const Item = require("../models/Item");
const User = require("../models/User");

async function createItem(item) {
  const result = new Item(item);
  await result.save();
  return result;
}

async function getItems() {
  return Item.find({}).sort({ createdAt: -1 }).limit(3).lean();
}

async function getAll() {
  return Item.find({}).lean();
}

async function getItemsByAuthor(userId) {
  return Item.find({ owner: userId }).populate("followList").lean();
}

async function getItemById(id) {
  return Item.findById(id).lean();
}

async function updateItem(id, item) {
  const existing = await Item.findById(id);

  existing.title = item.title;
  existing.imageUrl = item.imageUrl;
  existing.content = item.content;
  existing.category = item.category;

  await existing.save();
}

async function deleteItem(id) {
  return Item.findByIdAndDelete(id);
}

async function follow(itemId, userId) {
  const item = await Item.findById(itemId);

  if (item.followList.includes(userId)) {
    throw new Error("You have already followed this blog!");
  }
  item.followList.push(userId);

  await item.save();
}

async function getItemAndUsers(id) {
  return Item.findById(id).populate("owner").populate("followList").lean();
}

async function getUserAndItems(userId) {
  return Item.find({ followList: userId }).populate("followList").lean();
}



module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  follow,
  getItemsByAuthor,
  getUserAndItems,
  getItemAndUsers,
  getAll,
};
