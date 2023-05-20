const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;


// middleware
app.use(cors());
app.use(express.json());
// middleware



const uri = `mongodb+srv://${process.env.DB_PROJECT_TITLE}:${process.env.DB_KEY_PASS}@cluster0.cpjgoyc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toysCollection = client.db("kidsToys").collection("allToys");

        // .search(search).sort(sort)
        app.get('/allToys', async (req, res) => {
            // console.log(req.query.search)
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const skip = page * limit;
            // const sort = req.query.sort;
            const search = {
                search: { ToyName: 1, category_Name: 1 }
            }
            console.log(search)
            // const search = req.query.;
            console.log(search)
            const result = await toysCollection.find().skip(skip).limit(limit).toArray();
            res.send(result);
        })

        app.get('/totalToys', async (req, res) => {
            const result = await toysCollection.estimatedDocumentCount();
            // console.log({ totalToys: result })
            res.send({ totalToys: result });
        })

        app.post('/allToys', async (req, res) => {
            const getClient = req.body;
            const result = await toysCollection.insertOne(getClient);
            res.send(result);
        })

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        app.delete('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/allToys', async (req, res) => {
            const toyUpdate = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const toyUpdated = {
                $set: {
                    name: toyUpdate.ToyName,
                    price: toyUpdate.ToyPrice,
                    photo: toyUpdate.ToyPhoto,
                    seller: toyUpdate.SellerName
                }
            }
            const result = await toysCollection.updateOne(query, toyUpdated, option);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('kids paradise')
})

app.listen(port);