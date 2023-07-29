import { Router } from "express";
import GamesRoutes from "./games.routes.js";
import ClientsRoutes from "./clients.routes.js";
import RentalsRoutes from "./rentals.routes.js";

const router = Router();

router.use(GamesRoutes);
router.use(ClientsRoutes);
router.use(RentalsRoutes);

export default router;
