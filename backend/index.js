import express from "express";
import mongoose from "mongoose";
import Collector from "./schema.js";
import { validationResult } from "express-validator";
import { mintValidation } from "./validations.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3500;
const DB_URL = `mongodb+srv://admin:${process.env.DB_PASSWORD}@salarycluster.mtp2sic.mongodb.net/?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/collectors", mintValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { email } = req.body;
    const newCollector = new Collector({ email });
    const user = await newCollector.save();
    res.json({ ...user._doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error when create a collector",
    });
  }
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => console.log("Server is working on port " + PORT));
  } catch (error) {
    console.log(error);
  }
}

startApp();
