const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;


// middleware
app.use(cors());
app.use(express.json());
// middleware

// console.log(process.env.ACCESS_AUTHOR_SECRET_TOKEN)

const uri = `mongodb+srv://${process.env.DB_PROJECT_TITLE}:${process.env.DB_KEY_PASS}@cluster0.cpjgoyc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// const verifyUT = (req, res, next) => {
//     const authorization = req.headers.authorization;
//     if (!authorization) {
//         return res.status(401).send({ error: true, message: 'unauthorized' })
//     }
//     console.log('bearer with token', authorization)

//     const token = authorization.split(' ')[1];
//     console.log('only token', (token))
//     jwt.verify(token, process.env.ACCESS_AUTHOR_SECRET_TOKEN, (error, decoded) => {
//         if (error) {
//             return res.status(403).send({ error: true, message: 'unauthorized access' })
//         }
//         req.decoded = decoded;
//         console.log('i am authorized', decoded)
//         next();
//     })

// }

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toysCollection = client.db("kidsToys").collection("allToys");
        // JWT secure
        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_AUTHOR_SECRET_TOKEN, { expiresIn: '2h' });
        //     console.log('user 57 line', token)
        //     res.send({ token });
        // })

        // CLIENT SIDE ROUTES
        // all toy for pagination
        app.get('/allToys', async (req, res) => {
            // console.log('i cought the next function', decoded.email, 'my email', req.query?.email)
            // if (decoded.email !== req.query.email) {
            //     return res.status(403).send({ error: 1, message: 'forbidden access' })
            // }
            // let query = {};
            // if (req.query?.email) {
            //     query = { email: req.query.email }
            // }
            // console.log()
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const skip = page * limit;
            // const decoded = req.decoded;query
            // console.log('i get my data', decoded.email, 'my email', req.query.email)
            const result = await toysCollection.find().skip(skip).limit(limit).toArray();
            console.log('is it my', result)
            return res.send(result);
        });

        // get data by email 
        // app.get('/allToys', verifyUT, async (req, res) => {
        //     const decoded = req.decoded;
        //     if (decoded.email !== req.query.email) {
        //         return res.status(403).send({ error: 1, message: 'forbidden access' })
        //     }
        //     let query = {};
        //     if (req.query?.email) {
        //         query = { email: req.query?.email }
        //     }
        //     const result = await toysCollection.find(query).toArray();
        //     res.send(result)
        // })

        // toys array length
        app.get('/totalToys', async (req, res) => {
            // if (decoded.email !== req.query.email) {
            //     return res.status(403).send({ error: 1, message: 'forbidden access' })verifyUT, 
            // }
            const result = await toysCollection.estimatedDocumentCount();
            res.send({ totalToys: result });
        });


        // single toy find for details
        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result);
        });

        // create toy
        app.post('/allToys', async (req, res) => {
            const getClient = req.body;
            const result = await toysCollection.insertOne(getClient);
            res.send(result);
        });

        // delete single toy
        app.delete('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        });

        // update toy
        app.patch('/allToys/:id', async (req, res) => {
            const toyUpdate = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const toyUpdated = {
                $set: {
                    ToyPrice: toyUpdate.ToyPrice, ToyQuantity: toyUpdate.ToyQuantity, ToyDetails: toyUpdate.ToyDetails
                }
            }
            const result = await toysCollection.updateOne(filter, toyUpdated, option);
            res.send(result);
        });


        // toy search
        app.get('/allToys', async (req, res) => {
            const search = req.query.search;
            console.log(search)
            const filter = {
                title: { $regex: search, $options: 'i' }
            }
            const result = await toysCollection.find(filter).toArray();
            console.log(result)
            res.send(result)
        });

        // // sort price
        // app.get('/allToys', async (req, res) => {
        //     const sort = req.query.sort;
        //     const option = {
        //         sort: {
        //             'price': sort === 'asc' ? 1 : -1
        //         }
        //     };
        //     const result = await toysCollection.find(option).toArray();
        //     res.send(result);
        // })










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