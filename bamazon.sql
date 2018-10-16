DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT(11) AUTO_INCREMENT NOT NULL, 
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    stock_quantity INT(11) NOT NULL,
    price DECIMAL(10, 4) NOT NULL,
    PRIMARY KEY (item_id)
);

insert into products (product_name, department_name, stock_quantity, price)
values("Priceless Work of Art", "Art", 1, 499.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Your New Favorite Poster", "Art", 1, 79.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Amazing Photograph", "Art", 1, 299.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Super Cool Sweatshirt", "Merch", 25, 49.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Hilarious Bumper Sticker", "Merch", 99, 499.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Comfortable Graphic T-Shirt", "Merch", 25, 27.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Lightweight Regular Hat", "Merch", 1, 23.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Wake Up Happy Alarm Clock", "Miscellaneous", 30, 29.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Shower Beer Holster", "Miscellaneous", 100, 9.99);
insert into products (product_name, department_name, stock_quantity, price)
values("Inflatable Boat w/ Trolling Motor", "Miscellaneous", 20, 399.99);

