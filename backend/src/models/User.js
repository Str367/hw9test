import mongoose from "mongoose";

const schema = mongoose.Schema;

const UserSchema = new schema({
  name: String,
  subject: String,
  score: Number,
});

const User = mongoose.model("User", UserSchema);

export default User;
