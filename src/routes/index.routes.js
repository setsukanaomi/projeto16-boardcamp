import { Router } from "express";
import GamesRoutes from "./games.routes.js";
import ClientsRoutes from "./clients.routes.js";

const router = Router();

router.use(GamesRoutes);
router.use(ClientsRoutes);

export default router;
