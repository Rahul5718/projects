require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Job = require("./models/job");
const deviceToken = require('./models/deviceToken')
const path = require('path')
const Post = require('./models/post')
//firebase
const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
//multer
const multer = require("multer")
const cloudinary = require("./config/cloudinary");
const upload = multer({ storage: multer.memoryStorage() })

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./serviceAccountKey.json");

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});
const messaging = getMessaging(firebaseApp);

async function notifyAllDevices(job){
  const tokens = await deviceToken.find()
  if(tokens.length === 0) return;

  const message ={
    notification:{
      title : "new Job posted",
      body:`${job.title} at ${job.company}`  
    },
    tokens : tokens.map((t)=>t.token),
  }
  try{
    await messaging.sendEachForMulticast(message)
  }catch(err){
    console.error("Notification error:",err);
  }
}

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

app.post('/api/jobs',async (req,res)=>{
  const {title,company,level,tech,location,postedDay} = req.body

  if(!title || !company || !level || !tech || !location || !postedDay){
    return res.status(400).json({message:'data not provuded'})
  }

  const newJob =new Job({
    title,
    company,
    level,
    tech,location,
    postedDay,
    createdAt:new Date()
  })

  const savedJob = await newJob.save()

 return res.status(201).json({
      message: 'Job created successfully',
      job: savedJob
    });
})

app.get("/api/jobs/today", async (req, res) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const todaysJobs = await Job.find({ postedDay: today });
  res.json(todaysJobs);
});


app.post("/api/jobs", async (req, res) => {
  const newJob = new Job(req.body);
  await newJob.save();
  await notifyAllDevices(newJob)
  res.status(201).json(newJob);
});

app.post("/api/register-token", async(req,res)=>{
  const {token} = req.body

  try{
    await deviceToken.updateOne({token},{token},{upsert:true}) //avoid duplicate token
    res.status(200).json({message:'token saved'})
  }catch (err){
    res.status(500).json({error:"failed to save token"})
  }
})

app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }); // newest first
  res.json(posts);
})

app.post("/api/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
})

//multer

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto", // auto-detects image vs video
    });

    res.json({ url: result.secure_url, type: result.resource_type });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});