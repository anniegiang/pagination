const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/users");

mongoose.connect("mongodb://localhost/pagination-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0) return;
  Promise.all([
    User.create({ name: "User 1" }),
    User.create({ name: "User 2" }),
    User.create({ name: "User 3" }),
    User.create({ name: "User 4" }),
    User.create({ name: "User 5" }),
    User.create({ name: "User 6" }),
    User.create({ name: "User 7" }),
    User.create({ name: "User 8" }),
    User.create({ name: "User 9" }),
    User.create({ name: "User 10" }),
    User.create({ name: "User 11" }),
    User.create({ name: "User 12" }),
  ]).then(() => console.log("Added Users"));
});

app.get("/users", paginateResults(User), (req, res) => {
  res.json(res.paginated);
});

function paginateResults(Model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    const results = {};

    if (startIdx > 0) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (endIdx < (await Model.countDocuments().exec())) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    try {
      results.paginated = await Model.find().limit(limit).skip(startIdx).exec();
      res.paginated = results;
      next();
    } catch (error) {
      console.log(error);
    }
  };
}

app.listen(5000, () => {
  console.log("party at port 5000");
});
