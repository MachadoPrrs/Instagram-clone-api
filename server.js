const dotenv = require("dotenv");

dotenv.config(); // llamar antes de llamar la importancion de la db

//* Error Handling
/* This code sets up an event listener for the "uncaughtException" event in the Node.js process object.
This event is emitted when an unhandled exception is thrown in the code. The code inside the event
listener logs an error message and shuts down the server by calling process.exit(1). This is
important for preventing the server from continuing to run in an unstable state and potentially
causing further issues. */
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  console.log(err.name, err.message);
  process.exit(1);
});

const dbConnection = require("./database/dbConnection");
const app = require("./app");

// SET UP THE DB
dbConnection();

// SETUP THE APP
const PORT = process.env.PORT || "8000";
const server = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`)
);

//* Error Handling

/* This code is setting up an event listener for the "unhandledRejection" event in the Node.js process
object. This event is emitted when a Promise is rejected but no error handler is attached to it. The
code inside the event listener logs an error message and shuts down the server by calling
server.close() and then exiting the process with process.exit(1). This is important for preventing
the server from continuing to run in an unstable state and potentially causing further issues. */
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
