const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./app/routes"); // Importar rutas

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "MiClaveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));

// Servir el index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Usar las rutas
app.use("/", routes);

// Iniciar el servidor
app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));
