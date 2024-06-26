const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5175'],
}));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfjtmur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const milkCollection = client.db("milkDB").collection("milk");


    app.get('/milk', async(req, res) => {
        const cursor = milkCollection.find()
        const result = await cursor.toArray();
        res.send(result);
    })

    // for update
    app.get('/milk/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await milkCollection.findOne(query);
        res.send(result);
    })

    app.post('/milk', async (req, res) => {
        const newMilk = req.body;
        console.log(newMilk);
       
        const result = await milkCollection.insertOne(newMilk);
        res.send(result);
    })

    app.put('/milk/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedMilk = req.body;

        const milk = {
            $set: {
                name: updatedMilk.name, 
                quantity: updatedMilk.quantity, 
                supplier: updatedMilk.supplier, 
                taste: updatedMilk.taste, 
                category: updatedMilk.category, 
                details: updatedMilk.details, 
                photo: updatedMilk.photo
            }
        }

        const result = await milkCollection.updateOne(filter, milk, options);
        res.send(result);
    })


    app.delete('/milk/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await milkCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("MILK STORE IS RUNNING");
})

app.listen(port, ()=> {
    console.log(`MILK Server is running on port ${port}`)
})