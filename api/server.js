const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// 🔐 API KEY CHECK
app.use((req, res, next) => {
    if (req.path === "/" || req.path.startsWith("/v1/admin")) return next();

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({ error: "API key missing" });
    }

    if (apiKey !== "myapikey123") {
        return res.status(403).json({ error: "Invalid API key" });
    }

    next();
});

// ⚡ RATE LIMIT
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5000,
});
app.use(limiter);

// ------------------ MAIN ROUTES ------------------

app.get("/v1/states", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM state ORDER BY name");

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/v1/districts", async (req, res) => {
    try {
        const { state_id } = req.query;

        const result = await pool.query(
            "SELECT * FROM district WHERE state_id = $1 ORDER BY name",
            [state_id]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/v1/subdistricts", async (req, res) => {
    try {
        const { district_id } = req.query;

        const result = await pool.query(
            "SELECT * FROM subdistrict WHERE district_id = $1 ORDER BY name",
            [district_id]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/v1/villages", async (req, res) => {
    try {
        const { subdistrict_id } = req.query;

        const result = await pool.query(
            "SELECT * FROM village WHERE subdistrict_id = $1 ORDER BY name LIMIT 100",
            [subdistrict_id]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ------------------ ADMIN ROUTES ------------------

// 🔑 Generate API key (dummy)
app.post("/v1/admin/generate-key", (req, res) => {
    const newKey = "key_" + Math.random().toString(36).substring(2, 10);

    res.json({
        success: true,
        api_key: newKey
    });
});

// 📊 Logs (dummy data OR DB based)
app.get("/v1/admin/logs", async (req, res) => {
    try {
        // अगर table exist nahi hai toh dummy return karo
        const result = await pool.query(`
            SELECT * FROM api_logs
            ORDER BY created_at DESC
            LIMIT 50
        `);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {
        console.log("No logs table, sending dummy data");

        res.json({
            success: true,
            data: [
                { api_key: "demo123", endpoint: "/v1/states", response_time: 120 },
                { api_key: "demo456", endpoint: "/v1/villages", response_time: 95 }
            ]
        });
    }
});

// Root
app.get("/", (req, res) => {
    res.send("🚀 Village API is running");
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});