const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const exphbs = require("express-handlebars");

const session = require("express-session");
const FileStore = require("session-file-store")(session);

const authRoutes = require("./routes/authRoutes");
const AuthController = require("./controllers/AuthController");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Definição e configuração da sessão

app.use(
  session({
    name: "session",
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () { },
      path: require("path").join(__dirname, "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      httpOnly: true,
    },
  })
);

// O "AuthController.makeAuthMiddleware" faz com que a página home só possa ser acessada caso o usuário esteja logado.
app.get("/dashboard", AuthController.makeAuthMiddleware, async (req, res) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: req.session.userId,
    },
  });

  res.render("home", { usuario });
});

app.get("/", async (req, res) => {
  res.render("home");
});


app.use("/auth/", authRoutes);

app.listen(8000);
