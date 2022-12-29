import { Router } from "express";
import User from "../models/user";
import express from "express";

const router = Router();
router.use(express.json());

// const deleteDB = async () => {
//   try {
//     await User.deleteMany({});
//   } catch (e) {
//     throw new Error("Database deletion failed");
//   }
// };

// router.delete("/cards", (_, res) => {
//   deleteDB();
//   res.json({ message: "Database cleared" });
// });

// let existing = true;
// const saveData = async (name, subject, score) => {
//   existing = await User.findOne({ name, subject });
//   if (existing) {
//     await User.deleteOne({ name, subject });
//   }
//   try {
//     const newData = new User({ name, subject, score });
//     return newData.save();
//   } catch (e) {
//     throw new Error("User creation error: " + e);
//   }
// };

// router.post("/card", (req, res) => {
//   const name = req.body.name;
//   const subject = req.body.subject;
//   const score = req.body.score;

//   (async () => {
//     await saveData(name, subject, score);
//     res.json({
//       message: existing
//         ? `Updating:{name:${name}, subject:${subject}, score:${score}}`
//         : `Adding:{name:${name}, subject:${subject}, score:${score}}`,
//       card: true,
//     });
//   })();
// });

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
