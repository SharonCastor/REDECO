// archivo: backend/crear_db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/redeco.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS instituciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      estado TEXT NOT NULL,
      tipo TEXT NOT NULL,
      fecha_registro TEXT NOT NULL
    )
  `);
  console.log('Base de datos creada exitosamente.');
});

db.close();
