const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_LOCAL_URL;

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a la base de datos");
  } catch (error) {
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = dbConnection;
