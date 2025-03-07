const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");

const API_URL = "/auth";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // on vide la collection User avant de commencer les tests
  await User.deleteMany({});
});

afterAll(async () => {
  // on ferme la connexion après avoir terminé les tests
  await mongoose.connection.close();
});


describe("Tests d'intégration - Authentification", () => {
  let token;
  // ----------------------------- register -----------------------------


  // inscription
  test("✅ Inscription d'un nouvel utilisateur", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès.");
  });

  // on refais l'inscription avec le meme mail 

  test("❌ Échec inscription - email déjà utilisé", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "testuser@example.com",
      password: "newpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Cet email est déjà utilisé.");
  });



  // format email incorrecte et mot de passe trop court
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

  // ----------------------------- login -----------------------------
  // connexion d'un user qui existe
  
  test("✅ Connexion réussie d'un utilisateur existant", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    // on stocke le token pour les tests suivants -----------------
    token = res.body.token;
  });

  // connexion d'un user avec un mauvais mdp mais email bon
  test("❌ Échec connexion - mot de passe incorrect", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Identifiants invalides.");
  });

  // connexion d'un user qui existe pas du tout
  test("❌ Échec connexion - utilisateur inexistant", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Identifiants invalides.");
  });

  // format pas bon lors de la connexion

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

  // recup profil user avec token
  test("✅ Récupération du profil utilisateur connecté", async () => {
    const res = await request(app)
      .get(`${API_URL}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  // faux token
  test("❌ Échec récupération profil utilisateur - token invalide", async () => {
    const res = await request(app)
      .get(`${API_URL}/me`)
      .set("Authorization", "Bearer tokenfake");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Token invalide");
  });

  // aucun token
  test("❌ Échec récupération profil utilisateur - token manquant", async () => {
    const res = await request(app).get(`${API_URL}/me`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Accès non autorisé");
  });
  


});