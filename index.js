const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djl2y.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

const port = 5000

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
  res.send("Welcome to mobile valley server")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ProductsCollection = client.db(`mobile-valley`).collection("products");

  app.post('/addProducts', (req,res)=>{
      const productInfo = req.body
    ProductsCollection.insertOne(productInfo)
    .then(result => res.send(result.insertedCount>0))
  })


  app.get('/allProducts',(req,res) => {
    ProductsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    const productId = req.params.id
    ProductsCollection.deleteOne({_id: ObjectId(productId)})
    .then(result => res.send(result.deletedCount>0))
  })

  app.get('/product/:id',(req, res) => {
    const productId = req.params.id
    ProductsCollection.find({_id: ObjectId(productId)})
    .toArray((err, document)=>{
      res.send(document[0])
    })
  })

  const orderCollection = client.db("mobile-valley").collection("orders");
  app.post('/orderConfirm', (req, res) =>{
    const details = req.body
    console.log(details)
    orderCollection.insertOne(details)
    .then(result => res.send(result.insertedCount>0))
  })

  app.get('/order', (req, res) => {
    const email = req.query.email
    orderCollection.find({email: email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
});


  


app.listen( process.env.PORT || 5000)