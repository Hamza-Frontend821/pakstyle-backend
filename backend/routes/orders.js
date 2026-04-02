const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// POST /api/orders — public, place a new order
router.post("/", (req, res) => {
    const {
        order_id, customer_name, email, phone, address, city, province,
        total, status, payment, items
    } = req.body;

    if (!customer_name || !phone || !address || !city) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const oid = order_id || ("PS-" + Date.now().toString().slice(-6));

    db.query(
        "INSERT INTO orders (order_id, customer_name, email, phone, address, city, province, total, status, payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [oid, customer_name, email || "", phone, address, city, province || "", total || 0, status || "pending", payment || "cod"],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Insert order items if provided
            if (Array.isArray(items) && items.length > 0) {
                const itemRows = items.map(item => [oid, item.name || "", item.qty || 1, item.price || 0]);
                db.query(
                    "INSERT INTO order_items (order_id, product_name, qty, price) VALUES ?",
                    [itemRows],
                    (err2) => {
                        if (err2) console.error("Order items insert error:", err2.message);
                    }
                );
            }

            res.json({ message: "Order placed", order_id: oid });
        }
    );
});

// GET /api/orders — protected, get all orders with their items
router.get("/", auth, (req, res) => {
    db.query("SELECT * FROM orders ORDER BY date DESC", (err, orders) => {
        if (err) return res.status(500).json({ error: err.message });

        if (orders.length === 0) return res.json([]);

        const orderIds = orders.map(o => o.order_id);

        db.query(
            "SELECT * FROM order_items WHERE order_id IN (?)",
            [orderIds],
            (err2, items) => {
                if (err2) {
                    console.error("Order items fetch error:", err2.message);
                    return res.json(orders.map(o => ({ ...o, items: [] })));
                }

                const result = orders.map(o => ({
                    ...o,
                    items: items.filter(i => i.order_id === o.order_id)
                }));

                res.json(result);
            }
        );
    });
});

// PUT /api/orders/:id/status — protected, update order status
router.put("/:id/status", auth, (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Status updated" });
        }
    );
});

module.exports = router;