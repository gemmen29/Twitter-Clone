const mongoose = require("mongoose");
mongoose.connect(
  process.env.dbConnectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to mongoDB");
  }
);
module.exports = mongoose;
