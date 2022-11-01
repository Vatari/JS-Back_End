const User = require("../models/User");

async function register(username, email, password) {
  const existing = await getUserByEmail(email);

  if (existing) {
    throw new Error("Email is taken already");
  }

  const user = new User({ username, email, password });

  await user.save();
  return user;
}

async function login(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Wrong email or password");
  }
  const hasMatch = await user.validatePassword(password);

  if (!hasMatch) {
    throw new Error("Wrong email or password");
  }
  return user;
}

async function getUserByEmail(email) {
  const user = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
  return user;
}

module.exports = {
  login,
  register,
};
