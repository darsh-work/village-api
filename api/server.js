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

// 🔍 DEBUG: Check DB connection
console.log("DATABASE_URL:", process.env.DATABASE_URL);

pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL");

        // Test query
        client.query("SELECT COUNT(*) FROM cleaned_data")
            .then(res => {
                console.log("📊 cleaned_data count:", res.rows[0].count);
                client.release();
            })
            .catch(err => {
                console.error("❌ Query error:", err.message);
                client.release();
            });

    })
    .catch(err => {
        console.error("❌ DB connection failed:", err.message);
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

// STATES
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

// DISTRICTS
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

// SUBDISTRICTS
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

// ✅ FIXED VILLAGES ROUTE
app.get("/v1/villages", async (req, res) => {
    try {
        const { query } = req.query;

        let result;

        if (query) {
            result = await pool.query(
                `SELECT DISTINCT village_name AS name, village_code AS id
                 FROM cleaned_data
                 WHERE LOWER(village_name) LIKE LOWER($1)
                 LIMIT 50`,
                [`%${query}%`]
            );
        } else {
            result = await pool.query(
                `SELECT DISTINCT village_name AS name, village_code AS id
                 FROM cleaned_data
                 LIMIT 50`
            );
        }

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {
        console.error("Village API Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ------------------ ADMIN ROUTES ------------------

app.post("/v1/admin/generate-key", (req, res) => {
    const newKey = "key_" + Math.random().toString(36).substring(2, 10);

    res.json({
        success: true,
        api_key: newKey
    });
});

app.get("/v1/admin/logs", async (req, res) => {
    try {
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