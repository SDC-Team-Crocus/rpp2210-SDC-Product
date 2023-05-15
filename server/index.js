const express = require('express');
const path = require('path');
const port = 3001;
const { getProducts } = require('../database/pg');

const app = express();
app.use(express.json());

// console.log(req.query); //Access URL params
// console.log(req.body.params); //Access body params

//List Products - Params: page, count
app.get('/products', (req, res) => {
  getProducts(parseInt(req.query.count), parseInt(req.query.page))
  .then(data => {
    let returnedData = {product_id: req.query.product_id, results: data}
    res.status(200).send(returnedData)
  })
  .catch((err) => {
    res.sendStatus(404)
  });
});




app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

module.exports = app;