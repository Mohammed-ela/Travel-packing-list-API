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
  // on vide les trip et user
  await Trip.deleteMany({});
  await User.deleteMany({});

  // on creer un user 
  await request(app).post("/auth/register").send({
    email: "testtrip@example.com",
    password: "password123",
  });

  // on se connecte pour recup le token et pouvoir tester les trips
  const loginRes = await request(app).post("/auth/login").send({
    email: "testtrip@example.com",
    password: "password123",
  });

  token = loginRes.body.token;
});



describe("Tests d'intégration - Voyages", () => {


// creer un voyage
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
    expect(res.body.destination).toBe("Maroc");
    tripId = res.body._id;
  });

  // creer un voyage avec donne vide
  test("❌ Échec création voyage - données manquantes", async () => {
    const res = await request(app)
      .post(`${API_URL}/`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        destination: "",
        startDate: "",
        endDate: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // on liste les voyages de l'user
  test("✅ Lister les voyages de l'utilisateur", async () => {
    const res = await request(app)
      .get(`${API_URL}/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    // on sattend a obtenir maroc
    expect(res.body[0]).toHaveProperty("destination", "Maroc");
  });

  // recup un voyage specifique
  test("✅ Récupérer un voyage spécifique", async () => {
    const res = await request(app)
      .get(`${API_URL}/${tripId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("destination", "Maroc");
  });

  // recup un voyage avec un id incorrecte
  test("❌ Échec récupération voyage - ID invalide", async () => {
    const res = await request(app)
      .get(`${API_URL}/invalidId`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(500);  
    expect(res.body).toHaveProperty("message", "Erreur serveur.");
    expect(res.body).toHaveProperty("error"); 
  });
  
  // recup un voyage qui existe pas
  test("❌ Échec récupération voyage - voyage inexistant", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`${API_URL}/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Voyage non trouvé.");
  });

  // tester de recup un voyage sans token
  test("❌ Échec accès sans token", async () => {
    const res = await request(app)
      .get(`${API_URL}/`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Accès non autorisé");
  });

  //  recup un voyage avec un token invalide
  test("❌ Échec accès avec token invalide", async () => {
    const res = await request(app)
      .get(`${API_URL}/`)
      .set("Authorization", "Bearer faketoken2");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Token invalide");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
