const express = require("express");

const { search } = require("../controllers/searchController");
const { protect } = require("../controllers/authController");
const { validateSearch } = require("../validators/searchValidator");

const router = express.Router();

router.get("/search", protect, validateSearch, search);

module.exports = router;
