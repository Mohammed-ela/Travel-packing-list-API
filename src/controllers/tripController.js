const Trip = require("../models/Trip");

// Créer un nouveau voyage
const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Créer le voyage lié à l'utilisateur connecté
    const trip = new Trip({
      destination,
      startDate,
      endDate,
      user: req.user.userId, // Récupéré via le middleware d'authentification
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Récupérer tous les voyages de l'utilisateur connecté
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Récupérer un voyage spécifique avec ses items
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ message: "Voyage non trouvé." });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Ajouter un item à un voyage
const addItemToTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, quantity } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({ message: "Le nom et la quantité sont requis." });
    }

    const trip = await Trip.findOne({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ message: "Voyage non trouvé." });
    }

    // Ajouter l'item au voyage
    trip.items.push({ name, quantity, taken: false });
    await trip.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Marquer un item comme "pris"
const markItemAsTaken = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ message: "Voyage non trouvé." });
    }

    const item = trip.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item non trouvé." });
    }

    // Marquer l'item comme "pris"
    item.taken = true;
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Supprimer un item d'un voyage
const deleteItemFromTrip = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, user: req.user.userId });
    if (!trip) {
      return res.status(404).json({ message: "Voyage non trouvé." });
    }

    // Supprimer l'item
    trip.items = trip.items.filter((item) => item._id.toString() !== itemId);
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  addItemToTrip,
  markItemAsTaken,
  deleteItemFromTrip,
};
