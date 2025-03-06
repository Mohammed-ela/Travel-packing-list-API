const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trip");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB est connecté"))
  .catch((err) => console.error(err));


module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}
