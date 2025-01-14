const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

router.get("/", AuthController.login);

router.get("/login", AuthController.login);
router.post("/login", AuthController.loginPost);

router.get("/cadastro", AuthController.signup);
router.post("/cadastro", AuthController.signupPost);

router.get("/sair", AuthController.logout);

module.exports = router;
