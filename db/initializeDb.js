//dotenv
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initializeDb = async () => {
  try {
    await pool.connect();
    await pool.query(
      `CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, description TEXT, image BYTEA, date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );
    await pool.query(
      `CREATE TABLE suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        tel VARCHAR(15) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    // create trigger to update updated_at column
    await pool.query(
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `
    );

    // attach trigger to suppliers table
    await pool.query(
      ` CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON suppliers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
        `
    );
    await pool.query(
      ` ALTER TABLE suppliers ADD CONSTRAINT unique_name UNIQUE (name);`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS stores (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, location VARCHAR(255), phone VARCHAR(15), email VARCHAR(100), date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, description TEXT, category_id INT REFERENCES Categories(id) ON DELETE CASCADE, price DECIMAL(10, 2) NOT NULL, quantity INT NOT NULL DEFAULT 0,supplier_id INT REFERENCES Suppliers(id) ON DELETE SET NULL,image BYTEA, date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );
    await pool.query(
      `CREATE TABLE IF NOT EXISTS store_items (
        id SERIAL PRIMARY KEY,
        store_id INT NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id),
        FOREIGN KEY (item_id) REFERENCES items(id)
      );
      `
    );

    await pool.query(
      `ALTER TABLE store_items ADD CONSTRAINT unique_store_item UNIQUE (store_id, item_id);`
    );

    await pool.query(
      `CREATE TABLE IF NOT EXISTS item_movements (
        id SERIAL PRIMARY KEY,
        item_id INT REFERENCES Items(id) ON DELETE CASCADE,
        from_store_id INT REFERENCES Stores(id) ON DELETE CASCADE,
        to_store_id INT REFERENCES Stores(id) ON DELETE CASCADE,
        quantity INT NOT NULL,
        movement_type VARCHAR(50) NOT NULL, -- 'add', 'remove', 'transfer'
        movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT -- Notes about the movement
      );`
    );

    console.log("Database initialized successfully");
  } catch (error) {
    console.error(error);
  }
};

// insert data into tables

const insertData = async () => {
  try {
    await pool.query(
      `INSERT INTO categories (name, description) VALUES
      ('Smartphones', 'Mobile devices with advanced features like internet access and apps'),
      ('Laptops', 'Portable personal computers for various applications'),
      ('Accessories', 'Gadget accessories like chargers, cases, and headphones'),
      ('Gaming', 'Gaming consoles and accessories for gaming enthusiasts')
      ON CONFLICT (name) DO NOTHING;`
    );

    await pool.query(
      `INSERT INTO suppliers (name, tel, email, location) VALUES
      ('TechHub Supplies', '+1234567890', 'techhub@example.com', '123 Tech Lane, Silicon Valley'),
      ('SmartParts Inc.', '+1112223333', 'support@smartparts.com', '456 Modern Ave, New York'),
      ('Gizmo Distributors', '+9876543210', 'contact@gizmo.com', '789 Innovation Road, Austin')
      ON CONFLICT (name) DO NOTHING;`
    );

    await pool.query(
      `INSERT INTO stores (name, location, phone, email) VALUES
      ('TechCity', '123 Gadget Street, Silicon Valley', '+1234567890', 'store@techcity.com'),
      ('GadgetGalore', '456 Gadget Avenue, New York', '+1112223333', 'info@gadgetgalore.com'),
      ('GamingZone', '789 Gaming Road, Austin', '+9876543210', 'contact@gamingzone.com')
      ON CONFLICT (name) DO NOTHING;`
    );

    await pool.query(
      `INSERT INTO items (name, description, category_id, price, quantity, supplier_id) VALUES
      ('iPhone 14', 'Latest Apple smartphone with advanced features', 1, 999.99, 50, 1),
      ('Samsung Galaxy S23', 'High-end Samsung smartphone with premium features', 1, 799.99, 40, 1),
      ('Google Pixel 8', 'Latest Google smartphone with advanced AI features', 1, 699.99, 35, 2),
      ('Dell XPS 15', 'High-performance laptop with stunning display', 2, 1299.99, 30, 1),
      ('MacBook Pro 16"', 'Powerful Apple laptop for professionals', 2, 2399.99, 25, 1),
      ('Lenovo ThinkPad X1 Carbon', 'Lightweight, high-performance business laptop', 2, 1599.99, 15, 1),
      ('AirPods Pro', 'Wireless earbuds with noise cancellation', 3, 249.99, 100, 2),
      ('JBL Charge 5', 'Portable Bluetooth speaker with excellent sound quality', 3, 179.99, 80, 3),
      ('Wireless Mouse', 'Ergonomic wireless mouse with long battery life', 3, 29.99, 150, 3),
      ('Xbox Series X', 'Microsoft gaming console with cutting-edge graphics', 4, 499.99, 10, 1),
      ('PlayStation 5', 'Next-gen gaming console with powerful performance', 4, 499.99, 20, 1),
      ('Raspberry Pi 4', 'Compact computer for DIY projects and learning', 2, 74.99, 50, 2),
      ('Sony WH-1000XM5', 'Noise-cancelling over-ear headphones', 3, 399.99, 60, 2),
      ('iPad Pro 12.9"', 'Apple tablet with large screen and powerful performance', 2, 1099.99, 20, 1),
      ('USB-C Charger', 'Fast charging USB-C charger for multiple devices', 3, 29.99, 200, 3)
      ON CONFLICT (name) DO NOTHING;`
    );

    await pool.query(
      `INSERT INTO store_items (store_id, item_id, quantity) VALUES
      (1, 3, 50),
      (1, 5, 30),
      (2, 1, 40),
      (2, 4, 25),
      (3, 2, 60),
      (3, 6, 15),
      (1, 7, 20),
      (2, 8, 35),
      (3, 9, 45),
      (1, 10, 10)
      ON CONFLICT (store_id, item_id) DO NOTHING;`
    );

    await pool.query(
      `INSERT INTO item_movements (item_id, from_store_id, to_store_id, quantity, movement_type, description) VALUES
      (1, NULL, 1, 20, 'add', 'Added 20 iPhone 14 to Downtown Tech Store'), -- Adding stock
      (2, NULL, 2, 10, 'add', 'Added 10 Dell XPS 15 to Uptown Gadget Center'),
      (3, NULL, 1, 50, 'add', 'Added 50 AirPods Pro to Downtown Tech Store'),

      (1, 1, 2, 5, 'transfer', 'Transferred 5 iPhone 14 from Downtown to Uptown Tech Store'),
      (2, 2, 1, 3, 'transfer', 'Transferred 3 Dell XPS 15 from Uptown to Downtown Tech Store')
      ;`
    );

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

const main = async () => {
  try {
    await initializeDb();
    await insertData();
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
};

main();
