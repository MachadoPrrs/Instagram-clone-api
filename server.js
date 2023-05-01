const dotenv = require("dotenv");

dotenv.config(); // llamar antes de llamar la importancion de la db

//* Error Handling
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const dbConnection = require("./database/dbConnection");
const app = require("./app");

// SET UP THE DB
dbConnection();

// SET UP THE APP
const PORT = process.env.PORT || "8000";
const server = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`)
);

//* Error Handling
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
