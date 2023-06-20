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
async function getProducts(count, page, product_id) {///////////why cannot set default here?
  if (!count) {
    count = 5;
  }
  if (!page) {
    page = 1;
  }
  
  const offset = (page - 1) * count;
  
  // console.log("product_id===> ", product_id);
  if(!product_id) {
    const query = `SELECT * FROM products LIMIT $1 OFFSET $2`;
    const productsData = await pool.query(query, [count, offset]);
    // console.log("productsData===> ", productsData);
    return productsData;
  } else {
    // const query = `SELECT * FROM products WHERE id = $1`;////////////add JOIN here to made data look like atelier front end 
    
    const query = `SELECT
  p.id,
  p.name,
  p.slogan,
  p.description,
  p.category,
  p.default_price,
  json_agg(json_build_object('feature', f.feature, 'value', f.value)) AS features
FROM
  products p
JOIN
  features f ON p.id = f.productid
WHERE
  p.id = $1
GROUP BY
  p.id, p.name, p.slogan, p.description, p.category, p.default_price;
`
    
    
    const productData = await pool.query(query, [product_id]);
    // console.log("productData===> ", productData);
    return productData;
  }
  
};

// Product Information
// GET /products/:product_id
// Returns all product level information for a specified product id.
// Params: product_id
async function getProduct(product_id) {
  
  const query = `SELECT * FROM products WHERE id = $1`;////////////add JOIN here to made data look like atelier front end 
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