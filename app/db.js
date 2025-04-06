const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",      
    password: "12345",      
    database: "salidasalmacen"
});

// Verificar conexión
db.connect(err => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL ✅");
});

module.exports = db;
