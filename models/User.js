const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: [2, "Username must be at least 2 characters long!"],
  },
  email: {
    type: String,
    required: true,
    minLength: [10, "Email must be at least 10 characters long!"],
  },
  password: {
    type: String,
    required: true,
    minLength: [4, "Password must be at least 4 characters long!"],
  },
});

userSchema.index(
  { email: 1 },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
      if (err) {
        next(err);
        return;
      }

      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          next(err);
          return;
        }

        this.password = hash;
        next();
      });
    });

    return;
  }

  next();
});

userSchema.methods = {
  validatePassword: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

const User = model("User", userSchema);

module.exports = User;
