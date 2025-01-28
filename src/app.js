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

// bdd connexion
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB est connecté"))
  .catch((err) => console.error(err));

// lancement serv
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
