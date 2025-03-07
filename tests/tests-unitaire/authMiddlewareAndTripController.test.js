const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middleware/authMiddleware");


jest.mock("jsonwebtoken");
jest.mock("../../src/models/Trip");

describe("Tests unitaires - authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // Middleware valide avec un token valide
  test(" Middleware valide avec un token valide", () => {
    req.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ userId: "12345" });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validtoken", process.env.JWT_SECRET);
    expect(req.user).toEqual({ userId: "12345" });
    expect(next).toHaveBeenCalled();
  });

  // Middleware échoue sans token
  test(" Middleware échoue sans token", () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Accès non autorisé" });
    expect(next).not.toHaveBeenCalled();
  });

  // Middleware échoue sans token
  test(" Middleware échoue avec un token invalide", () => {
    req.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(() => { throw new Error("Invalid token") });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("invalidtoken", process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
  });

  // Middleware sans le bearer token (header fausse)
  test(" Middleware échoue avec Authorization mal formé", () => {
    req.headers.authorization = "BadHeader invalidtoken";
    jwt.verify.mockImplementation(() => { throw new Error("Invalid token") });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
  });
});
