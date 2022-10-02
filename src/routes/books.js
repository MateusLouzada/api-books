const express = require("express");
const checkToken = require("../utils/checkToken");

const router = express.Router();

const Book = require("../models/Book");

//Pegando todos os livros do usuário

router.get("/books_user/:id", checkToken, async (req, res) => {
  const idUser = req.params.id;

  const books = await Book.find({ idUser });

  if (!books) {
    return res
      .status(404)
      .json({ msg: "Nenhum livro encontrado para o usuário!" });
  }

  res.status(200).json({ books });
});

//Adicionar um livro a um usuário

router.post("/add_book", checkToken, async (req, res) => {
  const {
    name,
    dateInitial,
    dateFinal,
    read,
    haveBook,
    image,
    pages,
    readingTime,
    idUser,
  } = req.body;

  //Checar se o livro ja está cadastrado para este usuário

  const bookExist = await Book.findOne({ name, idUser });

  if (bookExist) {
    return res.status(422).json({ msg: "Esse livro já foi cadastrado!" });
  }

  //Cadastrar o livro para o usuário

  const book = new Book({
    name,
    dateInitial,
    dateFinal,
    read,
    haveBook,
    image,
    pages,
    readingTime,
    idUser,
  });

  try {
    await book.save();
    res.status(201).json({ msg: "Livro cadastrado com sucesso!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde!" });
  }
});

//Alterando dados de um livro do usuário

router.put("/change_book", checkToken, async (req, res) => {
  const {
    name,
    idUser,
    newDateInitial,
    newDateFinal,
    newReadingTime,
    newRead,
    newHaveBook,
  } = req.body;

  const book = await Book.findOne({ name, idUser });

  if (!book) {
    return res.status(404).json({ msg: "Esse livro não existe!" });
  }

  try {
    await Book.findOneAndUpdate(
      { name, idUser },
      {
        dateInitial: newDateInitial,
        dateFinal: newDateFinal,
        read: newRead,
        haveBook: newHaveBook,
        readingTime: newReadingTime,
      },
      { new: true }
    );
    return res.status(200).json({ msg: "Livro alterado com sucesso!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde!" });
  }
});

//Excluindo um livro

router.delete("/delete_book", checkToken, async (req, res) => {
  const { name, idUser } = req.body;

  const book = await Book.findOne({ name, idUser });

  if (!book) {
    return res.status(404).json({ msg: "Esse livro não existe!" });
  }

  try {
    await Book.deleteOne({ name, idUser });
    return res.status(200).json({ msg: "Livro deletado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde!" });
  }
});

module.exports = router;
