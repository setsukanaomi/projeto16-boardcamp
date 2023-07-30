import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { insertRentalsSchema } from "../schemas/rentals.schema.js";
import { FinishRental, GetRentals, InsertRentals } from "../controllers/rentals.controller.js";

const RentalsRoutes = Router();

RentalsRoutes.post("/rentals", validateSchema(insertRentalsSchema), InsertRentals);
RentalsRoutes.get("/rentals", GetRentals);
RentalsRoutes.post("/rentals/:id/return", FinishRental);
RentalsRoutes.delete("/rentals/:id");

export default RentalsRoutes;
