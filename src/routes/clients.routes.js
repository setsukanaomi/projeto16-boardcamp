import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { insertCustomerSchema } from "../schemas/clients.schema.js";
import { GetCustomerById, GetCustomers, InsertCustomer, UpdateCustomer } from "../controllers/customers.controller.js";

const ClientsRoutes = Router();

ClientsRoutes.post("/customers", validateSchema(insertCustomerSchema), InsertCustomer);
ClientsRoutes.get("/customers", GetCustomers);
ClientsRoutes.get("/customers/:id", GetCustomerById);
ClientsRoutes.put("/customers/:id", validateSchema(insertCustomerSchema), UpdateCustomer);

export default ClientsRoutes;
