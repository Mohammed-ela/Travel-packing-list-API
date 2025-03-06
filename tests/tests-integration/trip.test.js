const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Trip = require("../../src/models/Trip");
const User = require("../../src/models/User");

const API_URL = "/trips";
let token;
let tripId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Trip.deleteMany({});
  await User.deleteMany({});

  // Créer un utilisateur de test
  const res = await request(app).post("/auth/register").send({
    email: "testtrip@example.com",
    password: "password123",
  });

  // Se connecter et récupérer le token
  const loginRes = await request(app).post("/auth/login").send({
    email: "testtrip@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests d'intégration - Voyages", () => {
  test("✅ Créer un nouveau voyage", async () => {
    const res = await request(app)
      .post(`${API_URL}/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        destination: "Maroc",
        startDate: "2025-02-28",
        endDate: "2025-05-01",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    tripId = res.body._id;
  });

  test("✅ Lister les voyages de l'utilisateur", async () => {
    const res = await request(app)
      .get(`${API_URL}/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("✅ Récupérer un voyage spécifique", async () => {
    const res = await request(app)
      .get(`${API_URL}/${tripId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("destination", "Maroc");
  });
});
