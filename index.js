const express = require('express');
const {MongoClient} = require("mongodb");
const {ObjectId} = require("mongodb");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
dotenv.config();
//console.log(process.env.MONGO_URL);
const app = express();
const PORT=process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
var cors = require('cors');
app.use("/uploads",express.static(path.join(__dirname,"/uploads")))
app.use(
  cors({
    origin: "*",
    credentials:true, 
  })
);
app.use(express.json());
const client =new MongoClient(MONGO_URL);
const dbName = 'uploaddata';
async function main(){
  await client.connect();
  console.log('Connected successfully to server');
}
main()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
   
  })
  
  const uploadStorage = multer({ storage: storage})
  
  // Single files
  app.post("/upload/single", uploadStorage.single("file","Text"),async function(req,res) {
   const filedata =req.file;
   const heading =req.body.heading;
   const subheading =req.body.subheading;
   const description =req.body.description;
   const data1 ={heading,subheading,description,filedata};
   console.log(heading)
   
    //console.log(data);
const result= await client.db("uploaddata")
.collection("filelist").insertOne(data1);
   res.send(result);
    console.log(data1);
   
  })
  app.get("/upload/single",async(req, res) => {
    try{
      const files = await client.db("uploaddata")
      .collection("filelist").find({}).toArray();
      res.status(200).send(files);
      console.log(files)
  }catch(error) {
      res.status(400).send(error.message);
  }
  })
  app.get("/upload/single/:id",async(req, res) => {
        try{
          const{id}=req.params;
      console.log(req.params);
      const files = await client.db("uploaddata")
      .collection("filelist").findOne({_id: ObjectId(id)});
      res.status(200).send(files);
      console.log(files);
        }catch(error) {
      res.status(400).send(error.message);
  }
  })

  
  /*router.get("/",async function (req, res) {
    const movies=await getAllMovies();
    console.log(movies);
    res.send(movies);
     })
     export async function getAllMovies() {
  await client.db("b30wd").collection("movies")
    .find({})
    .toArray();
}

     */
  
  app.listen(PORT, () => {
    console.log(`Server on...${PORT}`)
  })