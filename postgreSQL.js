CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  default_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  default_style BOOLEAN NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  style_id INT NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (style_id) REFERENCES styles(id)
);

CREATE TABLE skus (
  id SERIAL PRIMARY KEY,
  style_id INT NOT NULL,
  quantity INT NOT NULL,
  size VARCHAR(10) NOT NULL,
  FOREIGN KEY (style_id) REFERENCES styles(id)
);

CREATE TABLE related_products (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  related_product_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (related_product_id) REFERENCES products(id)
);
