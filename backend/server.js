const express = require("express");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes 
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Frontend specific routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/pakstyle-admin.html', (req, res) => res.sendFile(path.join(__dirname, '../pakstyle-admin.html')));

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Frontend SPA fallback  
    res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ PakStyle Server LIVE: http://localhost:${PORT}`);
    console.log(`📱 Store:     http://localhost:${PORT}/`);
    console.log(`👨‍💼 Admin:    http://localhost:${PORT}/pakstyle-admin.html`);
    console.log(`📊 APIs:      http://localhost:${PORT}/api/products`);
    console.log(`🩺 Health:    http://localhost:${PORT}/health`);
    console.log(`🔐 Login:     admin / pakstyle2025`);
});

