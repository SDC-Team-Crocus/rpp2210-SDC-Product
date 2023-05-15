const { Pool } = require('pg');

const login = {
  user: "",
  host: "localhost",
  database: "postgres",
  password: "",
  port: 5432 //Default psql port
}

const pool = new Pool(login);
pool.connect();


// GET /products Retrieves the list of products.
async function getProducts (count = 5, page = 1) {///////////why cannot set default here?
  if (!count) {
    count = 5;
  }
  if (!page) {
    page = 1;
  }
  
  const offset = (page - 1) * count;

  const query = `
    SELECT *
    FROM products
    LIMIT $1
    OFFSET $2
  `;

  const productsData = await pool.query(query, [count, offset]);
  console.log("productsData===> ", productsData);
  return productsData;
};


module.exports.getProducts = getProducts;
module.exports.pool = pool;