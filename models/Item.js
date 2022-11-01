const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const URL_PATTERN =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const ItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [5, "Title must be at least 5 characters long!"],
      maxLength: [50, "Title must be at most 50 characters long!"],
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return URL_PATTERN.test(value);
        },
        message: "Image must be a valid URL",
      },
    },
    content: {
      type: String,
      required: true,
      minLength: [10, "Content must be at least 10 characters"],
    },
    category: {
      type: String,
      required: true,
      minLength: [3, "Category must be at least 3 characters"],
    },

    followList: { type: [ObjectId], ref: "User", default: [] },
    owner: { type: ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, //inserts creation date
  }
);

const Item = model("Item", ItemSchema);

module.exports = Item;
