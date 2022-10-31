const { isUser } = require("../middleware/guards");
const {
  getItems,
  getUserAndItems,
  searchItem,
  getItemAndUsers,
  getAll,
  getItemsByAuthor,
  getItemById,
} = require("../services/item");
const preload = require("../middleware/preload");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const items = await getItems();

  res.render("home", { title: "Home Page", items });
});

router.get("/catalog", async (req, res) => {
  const query = req.query.text;
  let items = await getAll();

  if (query) {
    items = await searchItem(query);
  }
  res.render("catalog", { title: "Catalog Page", items });
});

router.get("/details", async (req, res) => {
  const items = await getItems();
  res.render("details", { title: "Details Page", items });
});

router.get("/details/:id", preload(true), async (req, res) => {
  if (req.session.user) {
    res.locals.item.hasUser = true;
    res.locals.item.isOwner =
      req.session.user?._id == res.locals.item.owner._id;

    if (res.locals.item.followList.some((b) => b._id == req.session.user._id)) {
      res.locals.item.isFollower = true;
    }
  }
  res.locals.item.emailList = res.locals.item.followList
    .map((e) => e.email)
    .join(", ");

  res.render("details", { title: "Details" });
});

router.get("/profile", preload(true), isUser(), async (req, res) => {
  const items = await getItemsByAuthor(req.session.user._id);
  const followed = await getUserAndItems(req.session.user._id);

  const ownBlogs = items
    .map((b) => b.owner)
    .filter((i) => i._id == req.session.user._id);

  res.render("profile", { title: "Profile Page", items, ownBlogs, followed });
});

module.exports = router;
