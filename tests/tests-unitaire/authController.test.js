const { registerUser, loginUser } = require("../../src/controllers/authController");
const User = require("../../src/models/User");

jest.mock("../../src/models/User");

describe("Tests unitaires - authController", () => {
  test("✅ Vérifier que l'inscription crée un utilisateur", async () => {
    User.findOne.mockResolvedValue(null); // Simule un utilisateur inexistant
    User.prototype.save = jest.fn().mockResolvedValue({});

    const req = { body: { email: "test@example.com", password: "password123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur créé avec succès." });
  });

  test("❌ Vérifier que la connexion échoue si l'utilisateur n'existe pas", async () => {
    User.findOne.mockResolvedValue(null); // Simule un utilisateur inexistant

    const req = { body: { email: "test@example.com", password: "password123" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Identifiants invalides." });
  });
});
