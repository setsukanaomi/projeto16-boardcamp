import { db } from "../database/database.connection.js";

export async function InsertCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const CustomerExists = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
    if (CustomerExists.rowCount > 0) return res.sendStatus(409);

    await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [
      name,
      phone,
      cpf,
      birthday,
    ]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function GetCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT 
    id,
    name,
    phone,
    cpf,
    TO_CHAR (birthday, 'YYYY-MM-DD') as birthday 
    FROM customers;`);
    res.send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function GetCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await db.query(`SELECT * from customers WHERE id = $1;`, [id]);
    res.send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function UpdateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  try {
    const CustomerExists = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id != $2;`, [cpf, id]);
    if (CustomerExists.rowCount > 0) return res.sendStatus(409);

    await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id =$5`, [
      name,
      phone,
      cpf,
      birthday,
      id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
