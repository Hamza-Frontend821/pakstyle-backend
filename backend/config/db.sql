-- DATABASE SETUP
CREATE DATABASE IF NOT EXISTS pakstyle;
USE pakstyle;

-- USERS TABLE (ADMIN LOGIN)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) DEFAULT '',
  price FLOAT NOT NULL,
  old_price FLOAT DEFAULT NULL,
  category VARCHAR(50) DEFAULT 'clothing',
  badge VARCHAR(50) DEFAULT '',
  description TEXT,
  features TEXT,
  image TEXT
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE,
  customer_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  total FLOAT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  payment VARCHAR(50) DEFAULT 'cod',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50),
  product_name VARCHAR(255),
  qty INT DEFAULT 1,
  price FLOAT DEFAULT 0
);

-- DEFAULT ADMIN USER
-- Password is bcrypt hash of "pakstyle2025"
-- Run: node -e "const b=require('bcrypt');b.hash('pakstyle2025',10).then(h=>console.log(h))" to generate your own
INSERT IGNORE INTO users (username, password) VALUES 
('admin', '$2b$10$KE36mQdvmdTCAi9fDDUF/OKa3lL00Ul9kn8j74Pct95vO716imrB.');