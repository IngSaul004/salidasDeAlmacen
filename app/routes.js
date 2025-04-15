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
    const { Usuario, Nombre_Chofer, Lista_Cliente, Direccion_Cliente, Atencion_A, Telefono, Numero_Pedido, Quien_Solicita, Motivo_Salida, Observaciones, Fecha } = datosForm;
  
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
           (Folio, Usuario_id, Chofer_nombre, Cliente_nombre, Direccion, Atencion_a, Telefono, Numero_Pedido, Quien_solicita, Motivo_salida, Observaciones, Fecha) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [folioGenerado, usuarioId, Nombre_Chofer, Lista_Cliente, Direccion_Cliente, Atencion_A,Telefono, Numero_Pedido, Quien_Solicita, Motivo_Salida, Observaciones, fechaActual],
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

  router.get('/folios', (req, res) => {
    db.query('SELECT Folio FROM folio', (err, results) => {
      if (err) {
        console.error('Error al obtener folios:', err);
        return res.status(500).json({ error: 'Error al obtener folios' });
      }
      res.json(results); // esto devuelve un array de objetos: [{Folio: 1}, {Folio: 2}, ...]
    });
  });


  router.get('/folios/:folio', (req, res) => {
    const folio = req.params.folio;
  
    // Primero obtenemos los datos de la salida con el JOIN para obtener el nombre del usuario
    const querySalidas = `
    SELECT salidas.*, usuarios.Usuario AS UsuarioNombre
    FROM salidas
    JOIN usuarios ON salidas.Usuario_id = usuarios.id
    WHERE salidas.Folio = ?`;
  
    db.query(querySalidas, [folio], (err, salidaResult) => {
      if (err) {
        console.error('Error al obtener datos de salidas:', err);
        return res.status(500).json({ error: 'Error al obtener datos de salidas' });
      }
  
      if (salidaResult.length === 0) {
        return res.status(404).json({ error: 'No se encontró la salida para el folio especificado' });
      }
  
      // Después obtenemos los materiales
      const queryMateriales = 'SELECT * FROM materiales WHERE Folio = ?';
  
      db.query(queryMateriales, [folio], (err, materialesResult) => {
        if (err) {
          console.error('Error al obtener materiales:', err);
          return res.status(500).json({ error: 'Error al obtener materiales' });
        }
  
        res.json({
          salida: salidaResult[0], // Solo tomamos el primer resultado (único folio)
          materiales: materialesResult
        });
      });
    });
  });

  router.post('/actualizarSalida', (req, res) => {
    const { folio, usuario_id, fecha, datosGenerales, materiales } = req.body;
  
    // Actualizar `folio`
    db.query(
      'UPDATE folio SET Usuario_id = ?, Fecha = ? WHERE Folio = ?',
      [usuario_id, fecha, folio],
      (err) => {
        if (err) {
          console.error("Error al actualizar folio: ", err);  // Esto mostrará más detalles en la consola
          return res.status(500).json({ ok: false, error: 'Error al actualizar folio' });
        }
    
        // Actualizar `salidas`
        db.query(
          `UPDATE salidas SET
            Usuario_id = ?,
            Chofer_nombre = ?,
            Cliente_nombre = ?,
            Direccion = ?,
            Atencion_a = ?,
            Telefono = ?,
            Numero_Pedido = ?,
            Quien_solicita = ?,
            Motivo_salida = ?,
            Observaciones = ?,
            Fecha = ?
          WHERE Folio = ?`,
          [
            usuario_id,
            datosGenerales.Chofer_nombre,
            datosGenerales.Cliente_nombre,
            datosGenerales.Direccion,
            datosGenerales.Atencion_a,
            datosGenerales.Telefono,
            datosGenerales.Numero_Pedido,
            datosGenerales.Quien_solicita,
            datosGenerales.Motivo_salida,
            datosGenerales.Observaciones,
            fecha,
            folio
          ],
          (err) => {
            if (err) {
              console.error("Error al actualizar salidas: ", err);
              return res.status(500).json({ ok: false, error: 'Error al actualizar salidas' });
            }
    
            // Borrar materiales anteriores
            db.query(
              'DELETE FROM materiales WHERE Folio = ?',
              [folio],
              (err) => {
                if (err) {
                  console.error("Error al limpiar materiales: ", err);
                  return res.status(500).json({ ok: false, error: 'Error al limpiar materiales' });
                }
    
                // Insertar materiales nuevos
                if (materiales.length === 0) {
                  return res.json({ ok: true, mensaje: 'Salida actualizada sin materiales' });
                }
    
                let insertsPendientes = materiales.length;
                let errorEncontrado = false;
    
                materiales.forEach((mat) => {
                  db.query(
                    `INSERT INTO materiales (Folio, Codigo, Descripcion, Cantidad, Um, Observacion)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [folio, mat.Codigo, mat.Descripcion, mat.Cantidad, mat.Um, mat.Observacion],
                    (err) => {
                      if (err && !errorEncontrado) {
                        errorEncontrado = true;
                        console.error("Error al insertar material: ", err);  // Aquí también lo mostramos
                        return res.status(500).json({ ok: false, error: 'Error al insertar materiales' });
                      }
    
                      insertsPendientes--;
                      if (insertsPendientes === 0 && !errorEncontrado) {
                        res.json({ ok: true, mensaje: 'Salida actualizada correctamente' });
                      }
                    }
                  );
                });
              }
            );
          }
        );
      }
    );    
  });



  // Ruta para registrar nuevos usuarios
router.post("/registrarCliente", (req, res) => {
  const { cliente, direccion, contacto, numeroTelefonico} = req.body;
  
  const sql = "INSERT INTO clientes (Cliente, Direccion, Contacto, Numero ) VALUES (?, ?, ?, ?)";
  db.query(sql, [cliente, direccion, contacto, numeroTelefonico], (err, result) => {
      if (err) return res.status(500).json({ success: false, mensaje: "Error al registrar usuario" });

      res.json({ success: true, mensaje: "Usuario registrado correctamente" });
  });
});

//obtener cliente para la lista
router.get('/clienteList', (req, res) => {
  db.query('SELECT Cliente FROM clientes', (err, results) => {
    if (err) {
      console.error('Error al obtener el cliente:', err);
      return res.status(500).json({ error: 'Error al obtener el cliente' });
    }
    res.json(results); // esto devuelve un array de objetos: [{Folio: 1}, {Folio: 2}, ...]
  });
});

router.get('/clienteListInfo/:Cliente', (req, res) => {
  const cliente = req.params.Cliente; // <-- obtener el parámetro de la URL

  db.query('SELECT * FROM clientes WHERE Cliente = ?', [cliente], (err, results) => {
    if (err) {
      console.error('Error al obtener la información del cliente:', err);
      return res.status(500).json({ error: 'Error al obtener el cliente' });
    }

    res.json(results); // Devuelve un array de objetos
  });
});

router.post('/generarReporteSalida', (req, res) => {
  const { fechaInicial, fechaFinal, filtro } = req.body;
  console.log('Ruta /generarReporteSalida llamada');

  // Asegúrate de establecer las fechas a inicio y fin del día para ignorar la hora
  const fechaInicioFormateada = `${fechaInicial} 00:00:00`;
  const fechaFinalFormateada = `${fechaFinal} 23:59:59`;

  let query = `SELECT * FROM salidas WHERE Fecha BETWEEN ? AND ?`;
  let params = [fechaInicioFormateada, fechaFinalFormateada];

  if (filtro === 'Otros') {
    query += ` AND Motivo_salida NOT IN ('Venta', 'Maquila', 'Traspaso')`;
  } else if (filtro !== '0') {
    query += ` AND Motivo_salida = ?`;
    params.push(filtro);
  }

  db.query(query, params, (err, salidas) => {
    if (err) {
      console.error('Error al obtener salidas:', err);
      return res.status(500).json({ error: 'Error al consultar salidas' });
    }

    if (salidas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron salidas' });
    }

    const folios = salidas.map(s => s.Folio);
    const queryMateriales = `SELECT * FROM materiales WHERE Folio IN (?)`;

    db.query(queryMateriales, [folios], (err, materiales) => {
      if (err) {
        console.error('Error al obtener materiales:', err);
        return res.status(500).json({ error: 'Error al consultar materiales' });
      }

      res.json({ salidas, materiales });
    });
  });
});



  
module.exports = router;
