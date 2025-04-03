const express = require("express");
const bcryptjs = require("bcryptjs"); // Usamos bcryptjs consistentemente
const db = require("./db"); // Importar la conexión a MySQL
const path = require("path");

const router = express.Router();

// Ruta de login
router.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;
    
    const query = "SELECT * FROM usuarios WHERE Usuario = ?";
    db.query(query, [usuario], async (err, results) => {
        if (err) return res.status(500).json({ success: false, mensaje: "Error en el servidor" });

        if (results.length === 0) {
            return res.status(401).json({ success: false, mensaje: "Usuario no encontrado" });
        }

        const user = results[0];

        // Verificar la contraseña con bcryptjs
        const match = await bcryptjs.compare(contrasena, user.Contrasena);

        if (!match) {
            return res.status(401).json({ success: false, mensaje: "Contraseña incorrecta" });
        }
        // Guardar al usuario en la sesión
        req.session.user = user; // Guardamos el objeto 'user' completo en la sesión
        // Devuelves el resultado con el área para que el frontend sepa a dónde redirigir
        res.json({
            success: true,
            mensaje: "Inicio de sesión exitoso",
            Usuario: user
        });
    });
});

// Ruta para registrar nuevos usuarios
router.post("/registrar", (req, res) => {
    const { usuario, contrasena, correo} = req.body;
    const hash = bcryptjs.hashSync(contrasena, 10); // Usamos bcryptjs para crear el hash de la contraseña

    const sql = "INSERT INTO usuarios (Usuario, Contrasena, Correo, Area ) VALUES (?, ?, ?)";
    db.query(sql, [usuario, hash, correo], (err, result) => {
        if (err) return res.status(500).json({ success: false, mensaje: "Error al registrar usuario" });

        res.json({ success: true, mensaje: "Usuario registrado correctamente" });
    });
});


// Ruta protegida (salida)
router.get("/Captura", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirige a la página de inicio de sesión
    }
    res.sendFile(path.join(__dirname, "../public/views/captura.html"));
});


// Ruta protegida (menu)
router.get("/Menu", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirige a la página de inicio de sesión
    }
    res.sendFile(path.join(__dirname, "../public/views/menu.html"));
});


// Ruta protegida (edicion)
router.get("/Edicion", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirige a la página de inicio de sesión
    }
    res.sendFile(path.join(__dirname, "../public/views/edicion.html"));
});

// Ruta protegida (reporte)
router.get("/Reporte", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirige a la página de inicio de sesión
    }
    res.sendFile(path.join(__dirname, "../public/views/reporte.html"));
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/"); 
    });
});

module.exports = router;
