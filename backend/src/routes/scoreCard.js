import { Router } from "express";
import User from "../models/User";
const router = Router();
router.post("/card", async (req, res) => {
  let { name, subject, score } = req.body;
  const existing = await User.findOne({ name: name, subject: subject });
  if (existing) {
    res.json({
      message: "Updating (" + name + ", " + subject + ", " + score + ")",
    });
    try {
      await User.updateOne(
        { name: name, subject: subject },
        { $set: { score: score } }
      );
    } catch (e) {
      throw new Error("User creation error: " + e);
    }
  } else {
    const newUser = new User({ name, subject, score });
    res.json({
      message: "Adding (" + name + ", " + subject + ", " + score + ")",
    });
    return newUser.save();
  }
});

router.delete("/cards", async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ messages: [], message: "Database cleared" });
  } catch (e) {
    throw new Error("Database deletion failed");
  }
});
router.get("/cards", async (req, res) => {
  await console.log(req.query);
  let { type, queryString } = req.query;
  let returnedSet;
  if (type === "name") returnedSet = await User.find({ name: queryString });
  else returnedSet = await User.find({ subject: queryString });
  if (returnedSet.length == 0)
    res.json({ message: type + " ( " + queryString + " ) not found!" });
  else
    res.json({
      messages: returnedSet.map(
        (data) =>
          "Found card with subject: (" +
          data.name +
          ", " +
          data.subject +
          ", " +
          data.score +
          ")."
      ),
    });
});
export default router;
