import { Router } from "express";
import { ListGames, InsertGames } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { insertGameSchema } from "../schemas/games.schema.js";

const GamesRoutes = Router();

GamesRoutes.post("/games", validateSchema(insertGameSchema), InsertGames);
GamesRoutes.get("/games", ListGames);

export default GamesRoutes;
