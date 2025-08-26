const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.klnjmif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const groupsCollection = client.db('groupDB').collection('groups');
   const usersCollection = client.db('userDB').collection('users');


    // get
    app.get('/groups', async (req, res) => {
      const result = await groupsCollection.find().toArray();
      res.send(result);
    });


    app.get('/groups/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id:new ObjectId(id)}
      const result = await groupsCollection.findOne(query);
      res.send(result)
    })

   
   
    app.post('/groups', async (req, res) => {
    const newGroup = req.body;
   console.log("Received group:", newGroup);
   const result = await groupsCollection.insertOne(newGroup);
   res.send(result);
});


app.put('/groups/:id', async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true};
  
})


app.delete('/groups/:id', async (req,res)=>{
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await groupsCollection.deleteOne(query);
  res.send(result)
})


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hobby hub server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
