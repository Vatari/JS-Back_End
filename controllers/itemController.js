const { mapErrors } = require("../util/mappers");
const { isUser, isOwner, isGuest } = require("../middleware/guards");
const preload = require("../middleware/preload");

const {
  createItem,
  updateItem,
  deleteItem,
  follow,
} = require("../services/item");

const router = require("express").Router();

router.get("/create", isUser(), (req, res) => {
  res.render("create", { title: "Create Page" });
});

router.post("/create", isUser(), async (req, res) => {
  const userId = req.session.user._id;

  const item = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    content: req.body.content,
    category: req.body.category,
    owner: userId,
  };
  try {
    await createItem(item);
    res.redirect("/catalog");
  } catch (err) {
    const errors = mapErrors(err);
    res.render("create", { title: "Create Page", errors, item });
  }
});

router.get("/edit/:id", preload(), isUser(), isOwner(), async (req, res) => {
  res.render("edit", { title: "Edit Page" });
});

router.post("/edit/:id", preload(), isUser(), isOwner(), async (req, res) => {
  const id = req.params.id;

  const item = {
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    content: req.body.content,
    category: req.body.category,
  };

  try {
    await updateItem(id, item);
    res.redirect("/details/" + id);
  } catch (err) {
    const errors = mapErrors(err);
    item._id = id;
    res.render("edit", { title: "Edit Page", item, errors });
  }
});

router.get("/delete/:id", preload(), isOwner(), isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    await deleteItem(id);
    res.redirect("/catalog");
  } catch (err) {
    const errors = mapErrors(err);
    res.render("details", { title: existing.title, errors });
  }
});

router.get("/follow/:id/", isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    await follow(id, req.session.user._id);
    res.redirect("/details/" + id);
  } catch (err) {
    const errors = mapErrors(err);
    res.render("details", { title: "Details", errors });
  }
});

module.exports = router;
