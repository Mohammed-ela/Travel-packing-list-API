const express = require("express");
const { createTrip, getTrips } = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// liste des voyages (get)
router.get("/", authMiddleware, getTrips);

// creer son voyage (post)
router.post("/", authMiddleware, createTrip);

module.exports = router;
