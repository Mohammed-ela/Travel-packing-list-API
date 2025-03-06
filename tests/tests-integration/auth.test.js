const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app"); // Ne pas utiliser listen()
const User = require("../../src/models/User");

const API_URL = "/auth";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({}); // Nettoyer la collection avant les tests
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests d'intégration - Authentification", () => {
  let token;

  test("✅ Inscription d'un nouvel utilisateur", async () => {
    const res = await request(app)
      .post(`${API_URL}/register`)
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès.");
  });

  test("✅ Connexion avec un utilisateur existant", async () => {
    const res = await request(app)
      .post(`${API_URL}/login`)
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("❌ Connexion avec un mot de passe incorrect", async () => {
    const res = await request(app)
      .post(`${API_URL}/login`)
      .send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Identifiants invalides.");
  });

  test("✅ Récupération des informations de l'utilisateur", async () => {
    const res = await request(app)
      .get(`${API_URL}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });
});
