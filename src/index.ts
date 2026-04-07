import express from "express";
import type {Request, Response} from "express";
import pool from './config/db.js';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import cors from "cors";


const app = express();
app.use(cors())
app.use(express.json());
const PORT = 5000;


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);


app.get('/test-db', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT NOW()');
      res.json({ message: "Connected to Postgres!", time: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Database connection error");
    }
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Nexus API!" });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT || process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
}
export default app;