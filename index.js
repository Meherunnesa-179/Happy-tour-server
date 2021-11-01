const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000 ;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuadu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("happyTour");
        const placesCollection = database.collection("places");
        console.log('connected to database');
        //get api
        app.get('/places' , async(req , res) => {
            const cursor = await placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })
        //get single api/ place
        app.get('/places/:id' , async(req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const place = await placesCollection.findOne(query);
            res.json(place);
        })

        //post api

        app.post('/places' , async (req , res) => {
            // res.send('post hitted')
            const place = req.body;
            const result = await placesCollection.insertOne(place);
            // console.log('hit the post ', service);
            res.send(result)
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get( '/' , (req , res) => {
    res.send('running server')
})

app.listen( port , () =>{
    console.log('running port ' , port);
})