import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGODB_URL as string;
mongoose.connect(mongoUrl).then(() => {});

const couponSchema = new mongoose.Schema({
  data: Object, // You can save JSON data without a strict schema
});

const CouponModel = mongoose.model("Coupon", couponSchema);

app.use(express.json()); // Middleware to parse JSON requests
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("From Post Api");
});

app.post("/api/saveCouponJSON", async (req: Request, res: Response) => {
  try {
    const couponData = req.body;
    // Save JSON data in the coupon collection
    const coupon = new CouponModel({ data: couponData });
    await coupon.save();

    res.send("Coupon data saved successfully!");
  } catch (error) {
    console.error("Error saving coupon data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/fetchCouponJSON", async (req: Request, res: Response) => {
  try {
    // Fetch all saved coupons
    const coupon = await CouponModel.findOne({});

    res.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
