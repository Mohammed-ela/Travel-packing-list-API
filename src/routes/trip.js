///Users/elamrani/Desktop/Mobile/clement-backend/Travel-packing-list-API/src/routes/trip.js
const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  addItemToTrip,
  markItemAsTaken,
  deleteItemFromTrip,
} = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes pour les voyages
router.post("/", authMiddleware, createTrip); // Créer un voyage
router.get("/", authMiddleware, getTrips); // Lister les voyages
router.get("/:tripId", authMiddleware, getTripById); // Obtenir un voyage spécifique

// Routes pour les items d'un voyage
router.post("/:tripId/items", authMiddleware, addItemToTrip); // Ajouter un item
router.patch("/:tripId/items/:itemId/mark", authMiddleware, markItemAsTaken); // Marquer comme pris
router.delete("/:tripId/items/:itemId", authMiddleware, deleteItemFromTrip); // Supprimer un item

module.exports = router;
