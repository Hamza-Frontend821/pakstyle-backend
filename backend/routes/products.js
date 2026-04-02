const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// GET /api/products — public, returns all products
router.get("/", (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map DB columns to frontend-friendly field names
        const products = result.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            cat: p.category,
            price: p.price,
            old: p.old_price,
            badge: p.badge,
            desc: p.description,
            feats: (() => {
                try { return JSON.parse(p.features); } catch { return p.features ? [p.features] : []; }
            })(),
            images: (() => {
                try {
                    const parsed = JSON.parse(p.image);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch { return p.image ? [p.image] : []; }
            })()
        }));

        res.json(products);
    });
});

// POST /api/products — protected, add a new product
router.post("/", auth, (req, res) => {
    const { name, brand, category, price, old_price, badge, description, features, images } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
    }

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);
    const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

    db.query(
        "INSERT INTO products (name, brand, category, price, old_price, badge, description, features, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, brand || "", category || "clothing", price, old_price || null, badge || "", description || "", featuresJson, imagesJson],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product added", id: result.insertId });
        }
    );
});

// PUT /api/products/:id — protected, update a product
router.put("/:id", auth, (req, res) => {
    const { name, brand, category, price, old_price, badge, description, features, images } = req.body;
    const { id } = req.params;

    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);
    const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

    db.query(
        "UPDATE products SET name=?, brand=?, category=?, price=?, old_price=?, badge=?, description=?, features=?, image=? WHERE id=?",
        [name, brand || "", category || "clothing", price, old_price || null, badge || "", description || "", featuresJson, imagesJson, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Product updated" });
        }
    );
});

// DELETE /api/products/:id — protected, delete a product
router.delete("/:id", auth, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product deleted" });
    });
});

module.exports = router;