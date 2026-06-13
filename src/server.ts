import express from "express";
import {prisma} from './config/database'
import routes from './routes/index'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(express.json());

app.use("/api/v1", routes);


app.get("/", (req, res) => {
  res.send("working");
});

async function dbTest() {
  try {
    await prisma.$connect();
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
}

dbTest();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});