import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema({
  email: { type: String, required: true }
});

const Collector = mongoose.model("Collector", collectorSchema);

export default Collector;