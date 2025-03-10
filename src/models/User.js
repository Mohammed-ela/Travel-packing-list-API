///Users/elamrani/Desktop/Mobile/clement-backend/Travel-packing-list-API/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, "Email invalide"] },
  password: { type: String, required: true, minlength: 6 },
});
// avant de save (hook)
userSchema.pre("save", async function (next) {
  // si mdp est pas modifié alors
  if (!this.isModified("password")) return next();
  // 
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// fct pour comparer le mdp
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
