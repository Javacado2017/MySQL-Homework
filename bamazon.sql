-- Drops the database if it exists already --
DROP DATABASE IF EXISTS bamazon_db;

-- Creates the database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect the database --
USE bamazon_db;

-- Creates a 'products' table within the database --
CREATE TABLE products (
  -- Creates a numeric column called 'item_id' which auto-increments as each row of values is added --
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called 'product_name' which cannot contain null --
  product_name VARCHAR(30) NOT NULL,
  -- Makes an numeric column called 'item_price' --
  price_$ DECIMAL(10,2),
  -- Makes an numeric column called 'stock_quantity' --
  stocked_quantity INTEGER(10),
  -- Sets 'item_id' as table's primary key for unique row values --
  PRIMARY KEY (id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products 
    (product_name, price_$, stocked_quantity)
VALUES 
    ('Product 1', 1.25, 10),
    ('Product 2', 3.75, 15),
    ('Product 3', 2.25, 25),
    ('Product 4', 5.25, 15),
    ('Product 5', 4.75, 20),
    ('Product 6', 2.75, 10),
    ('Product 7', 1.50, 30),
    ('Product 8', 3.50, 15),
    ('Product 9', 4.25, 50),
    ('Product 10', 3.25, 30);

-- Used to select all columns from the table 'products' --
SELECT * FROM products;


