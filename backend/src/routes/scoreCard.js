import { Router } from "express";
import User from "../models/user";
import express from "express";

const router = Router();
router.use(express.json());

const deleteDB = async () => {
  try {
    await User.deleteMany({});
  } catch (e) {
    throw new Error("Database deletion failed");
  }
};

router.delete("/cards", (_, res) => {
  deleteDB();
  res.json({ message: "Database cleared" });
});

let existing = true;
const saveData = async (name, subject, score) => {
  existing = await User.findOne({ name, subject });
  if (existing) {
    await User.deleteOne({ name, subject });
  }
  try {
    const newData = new User({ name, subject, score });
    return newData.save();
  } catch (e) {
    throw new Error("User creation error: " + e);
  }
};

router.post("/card", (req, res) => {
  const name = req.body.name;
  const subject = req.body.subject;
  const score = req.body.score;

  (async () => {
    await saveData(name, subject, score);
    res.json({
      message: existing
        ? `Updating:{name:${name}, subject:${subject}, score:${score}}`
        : `Adding:{name:${name}, subject:${subject}, score:${score}}`,
      card: true,
    });
  })();
});

router.get("/cards", (req, res) => {
  const type = req.query.type;
  const val = req.query.queryString;

  if (type == "name") {
    (async () => {
      const matchData = await User.find({ name: val });
      res.json({
        messages:
          matchData.length > 0
            ? matchData.map(
                (e) =>
                  `Found card with name: (${e.name}, ${e.subject}, ${e.score})`
              )
            : false,
        message: `Name (${val}) not found!`,
      });
    })();
  } else {
    (async () => {
      const matchData = await User.find({ subject: val });
      res.json({
        messages:
          matchData.length > 0
            ? matchData.map(
                (e) =>
                  `Found card with subject: (${e.name}, ${e.subject}, ${e.score})`
              )
            : false,
        message: `Subject (${val}) not found!`,
      });
    })();
  }
});

export default router;
