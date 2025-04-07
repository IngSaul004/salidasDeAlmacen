const express = require("express");
const bcryptjs = require("bcryptjs"); // Usamos bcryptjs consistentemente
const db = require("./db"); // Importar la conexión a MySQL
const path = require("path");

const router = express.Router();

// Ruta de login
router.post("/login", async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ success: false, mensaje: "Usuario y contraseña son requeridos" });
    }

    const query = "SELECT * FROM usuarios WHERE Usuario = ?";
    db.query(query, [usuario], async (err, results) => {
        if (err) {
            console.error("Error en el servidor:", err);
            return res.status(500).json({ success: false, mensaje: "Error en el servidor" });
        }

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

        res.json({
            success: true,
            mensaje: "Inicio de sesión exitoso",
            Usuario: user
        });
    });
});

// Ruta para obtener el usuario de la sesión
router.get('/ObtenerUsuario', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, mensaje: 'No estás autenticado' });
    }
    res.json({ success: true, usuario: req.session.user });
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


// Ruta protegida (Cliente)
router.get("/Cliente", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/"); // Redirige a la página de inicio de sesión
    }
    res.sendFile(path.join(__dirname, "../public/views/clientes.html"));
});

// Obtener el último folio
router.get('/UltimoFolio', (req, res) => {
    db.query('SELECT Folio FROM folio ORDER BY Folio DESC LIMIT 1', (err, resultados) => {
      if (err) {
        console.error('Error al obtener el último folio:', err);
        res.status(500).send('Error al obtener el último folio');
      } else {
        const ultimoFolio = resultados.length > 0 ? resultados[0].Folio : 0;  // Asegúrate de usar .Folio con mayúscula
        res.json({ folio: ultimoFolio });
      }
    });
});


router.post('/registrarSalida', (req, res) => {
    const { datosForm, materiales } = req.body;  // Desestructuración de los datos recibidos
    const { Usuario, Nombre_Chofer, Lista_Cliente, Direccion_Cliente, Atencion_A, Numero_Pedido, Quien_Solicita, Motivo_Salida, Observaciones, Fecha } = datosForm;
  
    // Obtener el id del usuario de la sesión
    const usuarioId = req.session.user ? req.session.user.id : null;
  
    if (!usuarioId) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }
  
    const fechaActual = new Date();
  
    // Insertar en folio
    db.query(
      'INSERT INTO folio (Usuario_id, Fecha) VALUES (?, ?)',
      [usuarioId, fechaActual],
      (err, folioResult) => {
        if (err) {
          console.error('Error al insertar en folio:', err);
          return res.status(500).json({ error: 'Error al registrar la salida en folio' });
        }
  
        const folioGenerado = folioResult.insertId;
  
        // Insertar en salidas
        db.query(
          `INSERT INTO salidas 
           (Folio, Usuario_id, Chofer_nombre, Cliente_nombre, Direccion, Atencion_a, Numero_Pedido, Quien_solicita, Motivo_salida, Observaciones, Fecha) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [folioGenerado, usuarioId, Nombre_Chofer, Lista_Cliente, Direccion_Cliente, Atencion_A, Numero_Pedido, Quien_Solicita, Motivo_Salida, Observaciones, fechaActual],
          (err) => {
            if (err) {
              console.error('Error al insertar en salidas:', err);
              return res.status(500).json({ error: 'Error al registrar la salida en salidas' });
            }
  
            // Insertar cada material de forma síncrona con un contador
            let contador = 0;
  
            materiales.forEach((material, index) => {
              db.query(
                `INSERT INTO materiales 
                 (Folio, Codigo, Descripcion, Cantidad, Um, Observacion) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [folioGenerado, material.Codigo, material.Descripcion, material.Cantidad, material.Um, material.Observacion],
                (err) => {
                  if (err) {
                    console.error(`Error al insertar material ${index + 1}:`, err);
                  }
  
                  // Incrementamos el contador después de cada inserción
                  contador++;
  
                  // Verificamos si hemos insertado todos los materiales
                  if (contador === materiales.length) {
                    res.status(200).json({ mensaje: 'Salida registrada exitosamente', folio: folioGenerado });
                  }
                }
              );
            });
  
            // Si no hay materiales que insertar, respondemos directamente
            if (materiales.length === 0) {
              res.status(200).json({ mensaje: 'Salida registrada exitosamente', folio: folioGenerado });
            }
          }
        );
      }
    );
  });
  
  


module.exports = router;
