const express = require("express");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1422",
  database: "planning",
  connectionLimit: 5,
});

const app = express();
const port = 3000;

app.use(express.json());



// Endpoint obtener tareas
app.get('/tasks', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM todo');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo tareas.' });
  }
});


// agregar una nueva tarea
app.post('/tasks', async (req, res) => {
  const { name, description, status } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO todo (name, description, status) VALUES (?, ?, ?)', [name, description, status]);
    conn.release();
    res.json({ message: 'Tarea agregada correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar la tarea.' });
  }
});


//  actualizar una tarea por ID
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query('UPDATE todo SET name=?, description=?, status=? WHERE id=?', [name, description, status, id]);
    conn.release();
    res.json({ message: 'Tarea actualizada correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea.' });
  }
});

//  eliminar una tarea con su ID
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM todo WHERE id=?', [id]);
    conn.release();
    res.json({ message: 'Tarea eliminada correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la tarea.' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});



// app.get("/people/:id", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query(
//       "SELECT id, name, lastname, email FROM people WHERE id=?",
//       [req.params.id]
//     );

//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: "Se rompió el servidor" });
//   } finally {
//     if (conn) conn.release(); //release to pool
//   }
// });

// app.post("/people", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const response = await conn.query(
//       `INSERT INTO people(name, lastname, email) VALUE(?, ?, ?)`,
//       [req.body.name, req.body.lastname, req.body.email]
//     );

//     res.json({ id: parseInt(response.insertId), ...req.body });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Se rompió el servidor" });
//   } finally {
//     if (conn) conn.release(); //release to pool
//   }
// });

// app.put("/people/:id", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const response = await conn.query(
//       `UPDATE people SET name=?, lastname=?, email=? WHERE id=?`,
//       [req.body.name, req.body.lastname, req.body.email, req.params.id]
//     );

//     res.json({ id: req.params.id, ...req.body });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Se rompió el servidor" });
//   } finally {
//     if (conn) conn.release(); //release to pool
//   }
// });

// app.delete("/people/:id", async (req, res) => {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query("DELETE FROM people WHERE id=?", [
//       req.params.id,
//     ]);
//     res.json({ message: "Elemento eliminado correctamente" });
//   } catch (error) {
//     res.status(500).json({ message: "Se rompió el servidor" });
//   } finally {
//     if (conn) conn.release(); //release to pool
//   }
// });

// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });
