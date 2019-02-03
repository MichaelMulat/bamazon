CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(50),
    cost DECIMAL(13,2),
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
);


