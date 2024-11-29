const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class AuthController {
  static login(req, res) {
    if (req.session.userId) {
      console.log("Usuário já autenticado!");
      return res.redirect("/");
    }

    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, senha } = req.body;

    // Verificação de email
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      // Retornar informação ao usuário (email não encontrado)

      //req.flash("msg", "Usuário não encontrado!");
      console.log("Usuário não encontrado!");

      AuthController.login(req, res);
      return;
    }

    // Verificação de senha

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) {
      // Avisar ao usuário: senha incorreta
      //req.flash("msg", "Senha inválida!");
      console.log("Senha incorreta!");

      AuthController.login(req, res);
      return;
    }

    // Autentica

    //req.flash("msg", "Autenticado com sucesso!");
    console.log("Autenticado com sucesso!");

    req.session.userId = usuario.id;

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static signup(req, res) {
    if (req.session.userId) {
      console.log("Usuário já autenticado!");
      return res.redirect("/");
    }

    res.render("auth/cadastro");
  }

  static async signupPost(req, res) {
    const { email, senha, confirmaSenha } = req.body;

    // Verificação de senha
    if (senha != confirmaSenha) {
      //req.flash("msg", "As senhas não podem ser diferentes!");
      console.log("senhas diferentes");
      AuthController.signup(req, res);

      return;
    }

    // Verificação de email

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (usuario) {
      //req.flash("msg", "Já existe um usuário com este nickname!");

      console.log("Usuário já existe.");

      AuthController.signup(req, res);

      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashSenha = bcrypt.hashSync(senha, salt);

    const user = await prisma.usuario.create({
      data: {
        email,
        senha: hashSenha,
      },
    });

    //req.flash("msg", "Cadastro realizado com sucesso!");

    req.session.userId = user.id;

    req.session.save(() => {
      res.redirect("/");
    });
  }

  static logout(req, res) {
    req.session.destroy();
    console.log("Usuário deslogado com sucesso!");

    res.redirect("/auth/login");
  }

  static makeAuthMiddleware(req, res, next) {
    if (!req.session.userId) {
      //   req.flash(
      //     "msg",
      //     "Você precisa estar autenticado para acessar esta página!"
      //   );

      req.session.save(() => {
        res.redirect("/auth/login");
      });
      return;
    }

    next();
  }
};
