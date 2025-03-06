const { createTrip, getTrips } = require("../../src/controllers/tripController");
const Trip = require("../../src/models/Trip");

jest.mock("../../src/models/Trip");

describe("Tests unitaires - tripController", () => {
  test("✅ Vérifier que la création d'un voyage fonctionne", async () => {
    Trip.prototype.save = jest.fn().mockResolvedValue({ _id: "12345", destination: "Paris" });

    const req = { user: { userId: "123" }, body: { destination: "Paris", startDate: "2025-02-01", endDate: "2025-02-10" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createTrip(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ destination: "Paris" }));
  });

  test("✅ Vérifier que l'on peut récupérer les voyages", async () => {
    Trip.find.mockResolvedValue([{ destination: "Paris" }]);

    const req = { user: { userId: "123" } };
    const res = { json: jest.fn() };

    await getTrips(req, res);

    expect(res.json).toHaveBeenCalledWith([{ destination: "Paris" }]);
  });
});
