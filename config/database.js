require("dotenv").config();
const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to Mongodb");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectdb;
