import express from "express";
import type {Request, Response} from "express"
import pool from './src/config/db.js';
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";

const app = express();
app.use(express.json());
const PORT = 5000;


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);


app.get('/test-db', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ message: "Connected to Postgres!", time: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Database connection error");
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
