const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db/redeco.db');
const db = new sqlite3.Database(dbPath);

// Obtener todas las instituciones (con filtro de búsqueda opcional)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  db.all(`SELECT * FROM instituciones WHERE nombre LIKE ? OR estado LIKE ?`, [search, search], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Agregar nueva institución
router.post('/', (req, res) => {
  const { nombre, estado, tipo } = req.body;
  const fecha = new Date().toISOString().slice(0, 10);
  db.run(
    'INSERT INTO instituciones(nombre, estado, tipo, fecha_registro) VALUES (?, ?, ?, ?)',
    [nombre, estado, tipo, fecha],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nombre, estado, tipo, fecha_registro: fecha });
    }
  );
});

// Eliminar institución
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM instituciones WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: id });
  });
});

// Editar institución
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, estado, tipo } = req.body;
  db.run(
    'UPDATE instituciones SET nombre = ?, estado = ?, tipo = ? WHERE id = ?',
    [nombre, estado, tipo, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nombre, estado, tipo });
    }
  );
});

module.exports = router;

