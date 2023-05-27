require('dotenv').config();

const { Pool } = require('pg');

const login = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT 
}

const pool = new Pool(login);
pool.connect();


// List Products
// GET /products 
// Retrieves the list of products.
// Params: page, count
async function getProducts(count, page) {///////////why cannot set default here?
  if (!count) {
    count = 5;
  }
  if (!page) {
    page = 1;
  }
  
  const offset = (page - 1) * count;
  const query = `SELECT * FROM products LIMIT $1 OFFSET $2`;
  const productsData = await pool.query(query, [count, offset]);
  // console.log("productsData===> ", productsData);
  return productsData;
};

// Product Information
// GET /products/:product_id
// Returns all product level information for a specified product id.
// Params: product_id
async function getProduct(product_id) {
  
  const query = `SELECT * FROM products WHERE id = $1`;
  const productData = await pool.query(query, [product_id]);
  // console.log("productData===> ", productData);
  return productData;
};

// Product Styles
// GET /products/:product_id/styles
// Returns the all styles available for the given product.
// Params: product_id
async function getStyles(product_id) {
  const query = `SELECT * FROM styles WHERE productId = $1`;
  const productData = await pool.query(query, [product_id]);
  // console.log("stylesData===> ", productData);
  return productData;
};

// Related Products
// GET /products/:product_id/related
// Returns the id's of products related to the product specified.
// Params: product_id
async function getRelated(product_id) {
  const query = `SELECT related_product_id FROM related_products WHERE current_product_id = $1`;
  const productData = await pool.query(query, [product_id]);
  // console.log("stylesData===> ", productData);
  return productData;
};

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getStyles = getStyles;
module.exports.getRelated = getRelated;
module.exports.pool = pool;