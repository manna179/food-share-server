const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user  = plateShare

// pass = ZZ7RjXyAU4VfxFnb

const uri =
  "mongodb+srv://plateShare:ZZ7RjXyAU4VfxFnb@cluster0.ffjkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // const productCollection = client.db('emaJohnDB').collection('foods');

    const plateShareCollection = client.db("plateShare").collection("foods");

    app.post("/foods", async (req, res) => {
      const newFood = req.body;
      const result = plateShareCollection.insertOne(newFood);
      res.send(result);
    });

    app.patch("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const info = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: info.status,
        },
      };
      const result = await plateShareCollection.updateOne(filter, updatedDoc);
      res.send(result)
    });

    // app.post('/foods/:id',async(req,res)=>{

    // })
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await plateShareCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    app.put("/foods/:id", async (req, res) => {
      const body = req.body;
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await plateShareCollection.updateOne(query, {
        $set: {
          status: body.status,
          additionalNotes: body.additionalNotes,
          quantity: body?.quantity,
        },
      });

      console.log(result);
      res.send(result);
    });
    

    app.get("/foods", async (req, res) => {
      const email = req.query.email;
      // const expiredDate = req.body.
      console.log(email);
      if (email) {
        const result = await plateShareCollection.find({ email }).toArray();
        res.send(result);
      } else {
        const result = await plateShareCollection.find().toArray();
        res.send(result);
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("plateShare is looking at you");
});

app.listen(port, () => {
  console.log(`plateShare server is running on port: ${port}`);
});
