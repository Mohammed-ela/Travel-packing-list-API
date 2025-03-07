const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");

const API_URL = "/auth";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tests d'intégration - Authentification", () => {
  let token;

  test("✅ Inscription d'un nouvel utilisateur", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès.");
  });

  test("❌ Échec inscription - email déjà utilisé", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "testuser@example.com",
      password: "newpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Cet email est déjà utilisé.");
  });

  test("❌ Échec inscription - validation échouée", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "bademail",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Veuillez verifié le format de l'email" }),
        expect.objectContaining({ message: "Le mot de passe doit avoir au moins 6 caractères" }),
      ])
    );
  });

  test("✅ Connexion réussie d'un utilisateur existant", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("❌ Échec connexion - mot de passe incorrect", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Identifiants invalides.");
  });

  test("❌ Échec connexion - utilisateur inexistant", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Identifiants invalides.");
  });

  test("❌ Échec connexion - validation échouée", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "bademail",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Veuillez verifié le format de l'email" }),
        expect.objectContaining({ message: "Le mot de passe est trop court" }),
      ])
    );
  });

  test("✅ Récupération du profil utilisateur connecté", async () => {
    const res = await request(app)
      .get(`${API_URL}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  test("❌ Échec récupération profil utilisateur - token invalide", async () => {
    const res = await request(app)
      .get(`${API_URL}/me`)
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Token invalide");
  });

  test("❌ Échec récupération profil utilisateur - token manquant", async () => {
    const res = await request(app).get(`${API_URL}/me`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Accès non autorisé");
  });
});