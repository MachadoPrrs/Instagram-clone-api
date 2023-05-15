const express = require("express");

const { search } = require("../controllers/searchController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/search", protect, search);

module.exports = router;
