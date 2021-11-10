const express = require("express");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsejt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("watch-gallary");
    const userCollection = database.collection("register-user");
    const addProductCOllection = database.collection("add-product-list");
    const reviewCOllection = database.collection("reviews");
    const ordersCollection = database.collection("orders");
    // POST new register user API
    app.post("/register", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.json(result);
    });
    app.get("/register/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // update user api
    app.put("/register", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // post add product api
    app.post("/addproduct", async (req, res) => {
      const newPd = req.body;
      const result = await addProductCOllection.insertOne(newPd);
      res.json(result);
    });
    // post a review api
    app.post("/review", async (req, res) => {
      const newPd = req.body;
      const result = await reviewCOllection.insertOne(newPd);
      res.json(result);
    });
    // post orders  API
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder);
      res.json(result);
    });
    // get all order API
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateOrder.status,
        },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get specific order
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // delete orders api
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    // get all product API
    app.get("/allproduct", async (req, res) => {
      const cursor = addProductCOllection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/allproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addProductCOllection.findOne(query);
      res.json(result);
    });
    // delete products api
    app.delete("/allproduct/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await addProductCOllection.deleteOne(query);
      res.json(result);
    });
    // get all review api
    app.get("/review", async (req, res) => {
      const cursor = reviewCOllection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
