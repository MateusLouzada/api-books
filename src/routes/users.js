const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkToken = require("../utils/checkToken")

const router = express.Router();

const User = require("../models/User");



//Rota para registar
router.post("/auth/register", async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }
  if (!confirmPassword) {
    return res
      .status(422)
      .json({ msg: "A senha de confirmação é obrigatória" });
  }
  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas não conferem!" });
  }

  // Verificando se o usuário existe
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "E-mail já utilizado!" });
  }

  //Criando a senha segura do usuário

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //Criando o usuário

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde!" });
  }
});

//Login do usuário
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }

  //Verificação se usuário existe

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  //Verificando se a senha está correta

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde!" });
  }
});

module.exports = router;
