const mongoose = require("mongoose");
//voyage schema
const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: [true, "La destination est requise"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "La date de début est requise"],
  },
  endDate: {
    type: Date,
    required: [true, "La date de fin est requise"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Le voyage doit être lié à un utilisateur"],
  },
  //items est un tableau d'objets
  items: [
    {
      name: { type: String, required: [true, "Le nom de l'item est requis"] },
      quantity: { type: Number, default: 1 },
      taken: { type: Boolean, default: false },
    },
  ],
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
