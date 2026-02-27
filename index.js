import express from "express";
import cors from "cors";
import dotenv from "dotenv";



import authRoutes from "./routes/auth.js";
import bookings from "./routes/bookings.js";
import dashboard from "./routes/dashboard.js";
import payments from "./routes/payments.js";
import slots from "./routes/slots.js";
import vehicles from "./routes/vehicles.js";
import premiumSlots from "./routes/premiumSlots.js";
import premiumBookings from "./routes/premiumBookings.js";


dotenv.config();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}));

app.use(express.json());

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookings);
app.use("/api/dashboard", dashboard);
app.use("/api/payments", payments);
app.use("/api/slots", slots);
app.use("/api/vehicles", vehicles);

app.use("/api/premium-slots", premiumSlots);
app.use("/api/premium-bookings", premiumBookings);


app.get("/", (_, res) => res.send("API Running ✅"));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`✅ API server running at http://localhost:${PORT}`);
});

