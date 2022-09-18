require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routesUsers = require("./routes/users");
const routesBooks = require("./routes/books");

const app = express();

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  app.use(cors());
  next();
});
app.use(express.json());
app.use("/", routesUsers);
app.use("/books", routesBooks);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API" });
});

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.xo9nrkq.mongodb.net/API_Books?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 3333);
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((err) => console.log(err));
