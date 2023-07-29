import { Router } from "express";
import GamesRoutes from "./games.routes.js";

const router = Router();

router.use(GamesRoutes);

export default router;
