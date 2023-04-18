const mongoos = require("mongoose");

const app = require("./app");

const { DB_HOST } = process.env;

mongoos
  .connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch((error) => console.log(error.message));
