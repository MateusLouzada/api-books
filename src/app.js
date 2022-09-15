require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routesUsers = require("./routes/users");
const routesBooks = require("./routes/books");

const app = express();

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
    app.listen(process.env.PORT || 3000);
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((err) => console.log(err));
