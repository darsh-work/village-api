const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "village_db",
    password: "postgres123",
    port: 5432,
});

// 🔐 API KEY MIDDLEWARE
app.use(async (req, res, next) => {

    // ✅ allow root + admin
    if (req.path === "/" || req.path.startsWith("/v1/admin")) return next();

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({ error: "API key missing" });
    }

    const result = await pool.query(
        "SELECT * FROM api_keys WHERE api_key = $1 AND active = true",
        [apiKey]
    );

    if (result.rows.length === 0) {
        return res.status(403).json({ error: "Invalid API key" });
    }

    next();
});

// 📊 API LOGGING
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", async () => {
        const time = Date.now() - start;

        try {
            await pool.query(
                "INSERT INTO api_logs (api_key, endpoint, response_time) VALUES ($1, $2, $3)",
                [req.headers["x-api-key"], req.path, time]
            );
        } catch (err) {
            console.error("Logging error:", err.message);
        }
    });

    next();
});

// ⚡ RATE LIMITING
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5000,
    message: {
        error: "Too many requests, please try again later"
    }
});

app.use(limiter);

// ------------------ ROUTES ------------------

// Get all states
app.get("/v1/states", async (req, res) => {
    const start = Date.now();

    const result = await pool.query("SELECT * FROM state ORDER BY name");

    const end = Date.now();

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
        meta: {
            requestId: "req_" + Date.now(),
            responseTime: (end - start) + " ms"
        }
    });
});

// Get districts
app.get("/v1/districts", async (req, res) => {
    const start = Date.now();
    const { state_id } = req.query;

    const result = await pool.query(
        "SELECT * FROM district WHERE state_id = $1 ORDER BY name",
        [state_id]
    );

    const end = Date.now();

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
        meta: {
            requestId: "req_" + Date.now(),
            responseTime: (end - start) + " ms"
        }
    });
});

// Get subdistricts
app.get("/v1/subdistricts", async (req, res) => {
    const start = Date.now();
    const { district_id } = req.query;

    const result = await pool.query(
        "SELECT * FROM subdistrict WHERE district_id = $1 ORDER BY name",
        [district_id]
    );

    const end = Date.now();

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
        meta: {
            requestId: "req_" + Date.now(),
            responseTime: (end - start) + " ms"
        }
    });
});

// Get villages
app.get("/v1/villages", async (req, res) => {
    const start = Date.now();
    const { subdistrict_id } = req.query;

    const result = await pool.query(
        "SELECT * FROM village WHERE subdistrict_id = $1 ORDER BY name LIMIT 100",
        [subdistrict_id]
    );

    const end = Date.now();

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows,
        meta: {
            requestId: "req_" + Date.now(),
            responseTime: (end - start) + " ms"
        }
    });
});

// 🔍 AUTOCOMPLETE
app.get("/v1/autocomplete", async (req, res) => {
    const start = Date.now();
    const { q } = req.query;

    if (!q || q.length < 2) {
        return res.status(400).json({ error: "INVALID_QUERY" });
    }

    const result = await pool.query(
        `SELECT 
            v.name AS village,
            sd.name AS subdistrict,
            d.name AS district,
            s.name AS state
        FROM village v
        JOIN subdistrict sd ON v.subdistrict_id = sd.id
        JOIN district d ON sd.district_id = d.id
        JOIN state s ON d.state_id = s.id
        WHERE v.name ILIKE $1
        LIMIT 20`,
        [`%${q}%`]
    );

    const formatted = result.rows.map(row => ({
        value: `village_${row.village}`,
        label: row.village,
        fullAddress: `${row.village}, ${row.subdistrict}, ${row.district}, ${row.state}, India`,
        hierarchy: {
            village: row.village,
            subdistrict: row.subdistrict,
            district: row.district,
            state: row.state,
            country: "India"
        }
    }));

    const end = Date.now();

    res.json({
        success: true,
        count: formatted.length,
        data: formatted,
        meta: {
            requestId: "req_" + Date.now(),
            responseTime: (end - start) + " ms"
        }
    });
});

// 🔐 ADMIN: Generate API Key
app.post("/v1/admin/generate-key", async (req, res) => {
    try {
        const newKey = "key_" + Math.random().toString(36).substring(2, 15);

        await pool.query(
            "INSERT INTO api_keys (api_key, active) VALUES ($1, true)",
            [newKey]
        );

        res.json({
            success: true,
            api_key: newKey
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate key" });
    }
});

// 📊 ADMIN: Get Logs
app.get("/v1/admin/logs", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM api_logs ORDER BY created_at DESC LIMIT 50"
        );

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

// Root
app.get("/", (req, res) => {
    res.send("🚀 Village API is running");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});