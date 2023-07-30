import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function InsertRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const rentDate = dayjs().format("YYYY-MM-DD");

  try {
    const CustomerExists = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
    if (CustomerExists.rowCount < 1) return res.sendStatus(400);

    const GameExists = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
    if (GameExists.rowCount < 1) return res.sendStatus(400);

    const GamePrice = GameExists.rows[0].pricePerDay;
    const originalPrice = daysRented * GamePrice;

    const GameStock = GameExists.rows[0].stockTotal;

    const OpenRentals = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [
      gameId,
    ]);
    const OpenRentalsCount = parseInt(OpenRentals.rows[0].count, 10);
    if (OpenRentalsCount >= GameStock) return res.sendStatus(400);

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
      ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function GetRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT
    rentals.id,
    rentals."customerId",
    rentals."gameId",
    TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
    rentals."daysRented",
    TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
    rentals."originalPrice",
    rentals."delayFee",
    customers.id AS "idCustomer",
    customers.name AS "nameCustomer",
    games.id AS "idGame",
    games.name AS "nameGame"
  FROM rentals
  JOIN customers ON customers.id = rentals."customerId"
  JOIN games ON games.id = rentals."gameId";`);

    const processedRentals = rentals.rows.map((rental) => ({
      id: rental.id,
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate: rental.rentDate,
      daysRented: rental.daysRented,
      returnDate: rental.returnDate,
      originalPrice: rental.originalPrice,
      delayFee: rental.delayFee,
      customer: {
        id: rental.idCustomer,
        name: rental.nameCustomer,
      },
      game: {
        id: rental.idGame,
        name: rental.nameGame,
      },
    }));

    res.send(processedRentals);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function FinishRental(req, res) {
  const { id } = req.params;
  let delayFee = 0;
  const returnDateFormatted = dayjs();

  try {
    const rental = await db.query(
      `SELECT
      TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
      rentals."daysRented",
      TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate",
      rentals."originalPrice",
      games."pricePerDay"
      FROM rentals 
      JOIN games ON games.id=rentals."gameId"
      WHERE rentals.id=$1`,
      [id]
    );
    if (rental.rowCount < 1) return res.sendStatus(404);

    const { daysRented, pricePerDay, rentDate, returnDate } = rental.rows[0];
    if (returnDate === null) return res.sendStatus(400);

    const daysReturn = returnDateFormatted.diff(rentDate, "day");

    if (daysReturn > daysRented) {
      const daysFee = daysReturn - daysRented;
      delayFee = daysFee * pricePerDay;
    }

    await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [
      returnDateFormatted,
      delayFee,
      id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function DeleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if (rental.rowCount < 1) return res.sendStatus(404);

    const formattedRental = rental.rows[0];
    if (formattedRental.returnDate !== null) return res.sendStatus(400);

    await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
