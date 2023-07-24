import mongoose from "mongoose";

const wlCollectorSchema = new mongoose.Schema({
  wallet: { type: String, unique: true, required: true }
});

const WlCollector = mongoose.model("WlCollector", wlCollectorSchema);

export default WlCollector;