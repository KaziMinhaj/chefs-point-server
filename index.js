const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzhcz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const orderCollection = client.db("chefspoint").collection("orders");
  const reviewCollection = client.db("chefspoint").collection("review");
  const serviceCollection = client.db("chefspoint").collection("services");
  const adminsCollection = client.db("chefspoint").collection("admins");

  console.log("error mongoDB:", err);

  app.get("/", (req, res) => {
    res.send("server working with mongodb");
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    if (order.email) {
      orderCollection.insertOne(order).then((result) => {
        res.send(result.insertedCount > 0);
      });
    }
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;
    if (review.email) {
      reviewCollection.insertOne(review).then((result) => {
        res.send(result.insertedCount > 0);
      });
    }
  });

  app.get("/bookingList/:email", (req, res) => {
    orderCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
        console.log(err);
      });
  });
  app.get("/deleteService/:name", (req, res) => {
    serviceCollection
      .deleteOne({ name: req.params.name })
      .toArray((err, documents) => {
        res.send(documents);
        console.log(err);
      });
  });

  app.get("/bookingList", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(err);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(err);
    });
  });

  app.post("/addService", (req, res) => {
    const newData = req.body;
    serviceCollection.insertOne(newData).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const newData = req.body;
    adminsCollection.insertOne(newData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/admins/:email", (req, res) => {
    console.log(req.params.email);
    adminsCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
        console.log(err);
      });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(err);
    });
  });
});

app.listen(process.env.PORT || port);
