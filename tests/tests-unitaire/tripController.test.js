const { createTrip, getTrips } = require("../../src/controllers/tripController");
const Trip = require("../../src/models/Trip");

jest.mock("../../src/models/Trip");

describe("Tests unitaires - tripController", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { userId: "67ca380252eb1656c917d7e7" }, 
      body: { 
        destination: "Maroc", 
        startDate: "2025-02-28", 
        endDate: "2025-05-01"
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("✅ Vérifier que la création d'un voyage fonctionne", async () => {
    const tripMock = {
      _id: "67ca381352eb1656c917d7ea",
      destination: "Maroc",
      startDate: "2025-02-28T00:00:00.000Z",
      endDate: "2025-05-01T00:00:00.000Z",
      user: "67ca380252eb1656c917d7e7",
      items: [],
      save: jest.fn().mockResolvedValue(true)
    };

   
    Trip.mockImplementation(() => tripMock);

    await createTrip(req, res);


    expect(Trip).toHaveBeenCalledTimes(1);
    expect(Trip).toHaveBeenCalledWith({
      destination: "Maroc",
      startDate: "2025-02-28",
      endDate: "2025-05-01",
      user: "67ca380252eb1656c917d7e7"
    });


    expect(tripMock.save).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      destination: "Maroc",
      startDate: "2025-02-28T00:00:00.000Z",
      endDate: "2025-05-01T00:00:00.000Z",
      user: "67ca380252eb1656c917d7e7",
      items: []
    }));
  });

  test("✅ Vérifier que l'on peut récupérer les voyages d'un utilisateur", async () => {
    const tripsMock = [
      {
        _id: "67ca381352eb1656c917d7ea",
        destination: "Maroc",
        startDate: "2025-02-28T00:00:00.000Z",
        endDate: "2025-05-01T00:00:00.000Z",
        user: "67ca380252eb1656c917d7e7",
        items: []
      }
    ];

    Trip.find.mockResolvedValue(tripsMock);

    await getTrips(req, res);

    expect(Trip.find).toHaveBeenCalledTimes(1);
    expect(Trip.find).toHaveBeenCalledWith({ user: "67ca380252eb1656c917d7e7" });

    expect(res.json).toHaveBeenCalledWith(tripsMock);
  });
});
