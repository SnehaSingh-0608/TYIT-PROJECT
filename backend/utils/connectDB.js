const mongoose = require("mongoose");
//passowrd:S6h3oInuxukyhdKH
//username :snehasingh9076
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://snehasingh9076:S6h3oInuxukyhdKH@cluster0.ohuy8.mongodb.net/masync-mern-ai?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to Mongodb ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
