const express = require('express');
const path = require('path');
const port = 3001;
const { getProducts, getProduct, getStyles, getRelated } = require('../database/postgresDB');
const redis = require('redis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cache);


// Create a Redis client
const client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

function cache(req, res, next) {
  const key = "__express__" + req.originalUrl || req.url;

  client.get(key).then(reply => {    
    if (reply) {
      res.send(JSON.parse(reply));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        //expire in 1 min
        // console.log('body====> ', body);
        client.set(key, JSON.stringify(body), {'EX':60});
        res.sendResponse(body);
      };
      next();
    }
  }).catch(err=>{
    console.log(err);
    res.status(500).send(err)
  });
}




// // console.log(__dirname);
// app.get('/loaderio-cdd2290388a433d47e0813a650dea16c', (req, res) => {
//   res.sendFile(path.join(__dirname, "/loaderio-cdd2290388a433d47e0813a650dea16c.txt"));
//   }
// )



app.get('/loaderio-cdd2290388a433d47e0813a650dea16c', (req, res) => {
  res.sendFile(path.join(__dirname, "/loaderio-cdd2290388a433d47e0813a650dea16c.txt"));
});

app.get('/loaderio-cdd2290388a433d47e0813a650dea16c', (req, res) => {
  // Disable caching for this specific route
  next();
});
// console.log(req.query); //Access URL params
// console.log(req.body.params); //Access body params

// List Products
// GET /products 
// Retrieves the list of products.
// Params: page, count
app.get('/products', (req, res) => {
  getProducts(parseInt(req.query.count), parseInt(req.query.page))
  .then(data => {
    // let returnedData = {product_id: req.query.product_id, results: data}
    res.status(200).send(data.rows)
  })
  .catch((err) => {
    res.sendStatus(404)
  });
});



// Product Information
// GET /products/:product_id
// Returns all product level information for a specified product id.
// Params: product_id
// app.get('/product', (req, res) => {
//   console.log("req.query.product_id===> ", req.query.product_id);
//   getStyles(parseInt(req.query.product_id))
//   .then(data => {
//     res.status(200).send(data.rows[0])
//   })
//   .catch((err) => {
//     res.sendStatus(404)
//   });
// });

app.get('/product', (req, res) => {
  // console.log("req.query.product_id===> ", req.query.product_id);
  getStyles(parseInt(req.query.product_id))
  .then(data => {
    res.status(200).send(data.rows[0])
  })
  .catch((err) => {
    res.sendStatus(404)
  });
});




// Product Styles
// GET /products/:product_id/styles
// Returns the all styles available for the given product.
// Params: product_id
app.get('/styles', (req, res) => {
  getStyles(parseInt(req.query.product_id))
  .then(data => {
    res.status(200).send(data.rows)
  })
  .catch((err) => {
    res.sendStatus(404)
  });
});

// Related Products
// GET /products/:product_id/related
// Returns the id's of products related to the product specified.
// Params: product_id
app.get('/related', (req, res) => {
  getRelated(parseInt(req.query.product_id))
  .then(data => {
    let results = data.rows.map(item => item.related_product_id)
    res.status(200).send(results)
  })
  .catch((err) => {
    res.sendStatus(404)
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  client.connect().then(()=> {
    console.log('redis is connected')
  })
});

module.exports = app;