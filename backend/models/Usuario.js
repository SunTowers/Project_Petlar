const db = require("../database/database");

module.exports = {
  criar: (nome, email, senha, callback) => {
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    db.run(query, [nome, email, senha], function (err) {
      callback(err, this?.lastID);
    });
  },

  buscarPorEmail: (email, callback) => {
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, row) => {
      callback(err, row);
    });
  },

  buscarPorId: (id, callback) => {
    db.get(`SELECT * FROM usuarios WHERE id = ?`, [id], (err, row) => {
      callback(err, row);
    });
  }
};