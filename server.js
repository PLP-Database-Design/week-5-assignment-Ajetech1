// server.js
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection pool using credentials from .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
});

// Endpoint 1: Retrieve all patients
app.get("/patients", (req, res) => {
  pool.query(
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients",
    (error, results) => {
      if (error) {
        console.error("Error retrieving patients:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});

// Endpoint 2: Retrieve all providers
app.get("/providers", (req, res) => {
  pool.query(
    "SELECT first_name, last_name, provider_specialty FROM providers",
    (error, results) => {
      if (error) {
        console.error("Error retrieving providers:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});

// Endpoint 3: Filter patients by first name
app.get("/patients/filter", (req, res) => {
  const firstName = req.query.first_name;
  if (!firstName) {
    return res.status(400).send("First name is required");
  }

  pool.query(
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?",
    [firstName],
    (error, results) => {
      if (error) {
        console.error("Error filtering patients:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});

// Endpoint 4: Retrieve all providers by their specialty
app.get("/providers/specialty", (req, res) => {
  const specialty = req.query.specialty;
  if (!specialty) {
    return res.status(400).send("Specialty is required");
  }

  pool.query(
    "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?",
    [specialty],
    (error, results) => {
      if (error) {
        console.error("Error retrieving providers by specialty:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});
