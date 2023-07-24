import express from "express";
import mongoose from "mongoose";
import Collector from "./schema.js";
import WlCollector from "./wlSchema.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3500;
const DB_URL = `mongodb+srv://admin:${process.env.DB_PASSWORD}@salarycluster.mtp2sic.mongodb.net/?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/collectors", async (req, res) => {
  try {
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

app.post("/wlcollectors", async (req, res) => {
    try {
      const { wallet } = req.body;
      const newWlCollector = new WlCollector({ wallet });
      const user = await newWlCollector.save();
      res.json({ ...user._doc });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error when create a white list collector",
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
