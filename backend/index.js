const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {authenticateToken} = require("./utilities.js");
const upload = require("./multer.js")
const fs = require("fs");
const path = require("path");

const User = require("./models/user.model.js");
const TravelStory = require("./models/travelStory.model.js")

mongoose
  .connect(config.connectionString)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Connection failed:", err));

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Create account
app.post("/create-user", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields required" });
  }

  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User Already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    //doubt content
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await user.save();

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "72h",
      }
    );

    return res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      message: "Registered Successfully",
      accessToken,
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ error: true, message: "Server error. Please try again." });
  }
});
//login 
app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res
        .status(400).json({error: true, message: "All fields required"})
    }
    const user = await User.findOne({email});
    if(!user){
        return res
        .status(400)
        .json({error: true, message: "User not found"});

    
    }

//doubt content
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({error: true, message: "Invalid Password"});
    } 
// doubt content
    const accessToken = jwt.sign(
        {
            userId: user._id
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: "72h"
        }
    )

    return res.status(200).json({
        error: false,
        message: "Login Successfully",
        //doubt content
        user: {fullname: user.fullname,email: user.email},
        accessToken
    })
});

// get user
app.get("/get-user", authenticateToken, async (req,res)=>{
   const {userId} = req.user

   const isUser = await User.findOne({_id: userId});
   if(!isUser){
    return res.status(401);
   }
   return res.json(
    {
        user: isUser,
        message: ""
    }
   )
  
});

// Add Travel Story

app.post("/add-travel-story", authenticateToken, async (req,res)=>{
const {title, story, visitedLocation, imageUrl, visitedDate}=req.body;
const {userId} = req.user;

//validate required fields
if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
  return res.status(400).json({error:true, message:"All fields are required"})
}
 //convert visitedDate from milliseconds to Date object
 const parsedVisitedDate = new Date(parseInt(visitedDate));
 try{
  const travelStory = new TravelStory({
    title,
    story,
    visitedLocation,
    userId,
    imageUrl,
    visitedDate:parsedVisitedDate
  });
  await travelStory.save();
  res.status(201).json({story: travelStory, message:"Added Successfully"})
 }
 catch(error){
  res.status(400).json({error:true, message:error.message}) 
 }
});

// get all stories
app.get("/get-all-stories", authenticateToken, async (req,res)=>{
  const {userId}= req.user;

  try{
      const travelStories = await TravelStory.find({userId: userId}).sort({isFavourite: -1});
      res.status(200).json({stories: travelStories})
  }
  catch(error){
      res.status(500).json({error: true, message: error.message})
  }
})

// Route to handel image upload
app.post("/image-upload", upload.single("image"), async (req,res)=>{
  try{
    if(!req.file){
      return res.status(400).json({error: true, message:"No image uploaded"})
    }
  const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
  res.status(201).json({imageUrl});
  }
  catch(error){
    res.status(500).json({error: true, message: error.message})
  }
})

// delete image
app.delete("/image-delete", async (req,res)=>{
const {imageUrl} = req.query;

  if(!imageUrl){
    return res.status(400).json({error: true, message:"Immage Url parameter is not required"})
  }
  try{
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname,"uploads",filename);

    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
        res.status(200).json({message:"Immage deleted successfully"})
    }
    else{
      res.status(200).json({error: true,message:"Image not found"})
    }
  }
  catch(error){
    res.status(500).json({error: true, message: error.message});
  }
})

// Edit travel story

app.put("/edit-travel-story/:id", authenticateToken, async (req,res)=>{
  const {id} = req.params;
  const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;
  const {userId} = req.user;

  if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
    return res.status(400).json({error:true, message:"All fields are required"})
  }
   //convert visitedDate from milliseconds to Date object
   const parsedVisitedDate = new Date(parseInt(visitedDate));

   try{
    const travelStory = await TravelStory.findOne({_id: id, userId: userId});
    if(!travelStory){
      return res.status(404).json({error:true,message:"Travel story not found"});
    }
    const placeholderImageUrl = `http://localhost:8000/assets/travelimage.jpeg`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImageUrl;
    travelStory.visitedDate = parsedVisitedDate;
    await travelStory.save();
    return res.status(200).json({error: false, message:"Updated successfully"}); 

    }
    catch(error){
      return res.status(500).json({error: true, message: error.message});
    }
   }
)

// delete a travel story
app.delete("/delete-story/:id", authenticateToken, async (req, res)=>{
  const {id} = req.params;
  const {userId} = req.user;

  try{
    const travelStory = await TravelStory.findOne({_id: id, userId: userId});
    if(!travelStory){
      return res.status(404).json({error:true,message:"Travel story not found"});
    }
    await travelStory.deleteOne({_id: id, userId: userId});
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    const filePath = path.join(__dirname, "uploads", filename);
    fs.unlink(filePath,(err)=>{
      if(err){
        console.log("Failes to delete the image:",err);
      }
    })
    res.status(200).json({error: false, message: "Travel story deleted successfully"});
  }
  catch(error){
    res.status(400).json({error: true, message: error.message});
  }
})

// update is favourite
app.put("/update-is-favourite/:id", authenticateToken, async (req,res)=>{
  const {id} = req.params;
  const {isFavourite} = req.body;
  const {userId} = req.user;

  try{
    const travelStory = await TravelStory.findOne({_id:id, userId: userId});
    
    if(!travelStory){
      return res.status(404).json({error: true, message:"Travel Story not found"});
    }
    travelStory.isFavourite = isFavourite;
    await travelStory.save();
    res.status(200).json({error: false, message: "Updated successfully"});
  }
  catch(error){
    res.status(500).json({error:true, message: error.message});
  }
})

//search 
app.get("/search", authenticateToken, async (req,res)=>{
  const {query} = req.query;
  const {userId} = req.user;

  if(!query){
    return res.status(404).json({error:true, message: "Query is required"});
  }
  try{
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        {title : {$regex: query,  $options: "i"}},
        {story : {$regex: query,  $options: "i"}},
        {visitedLocation : {$regex: query,  $options: "i"}},
      ],
    }).sort({isFavourite: -1});
    res.status(200).json({stories: searchResults})
  }
  catch(error){
    res.status(500).json({error: true, message: error.message});
  }
})

// travel stories by date range
app.post("/travel-stories/filter", authenticateToken, async (req,res)=>{
  const {startDate, endDate} = req.query;
  const {userId} = req.user;
  
  try{
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: {$gte: start, $lte: end},
    }).sort({isFavourite: -1});
    res.status(200).json({stories: filteredStories});
  }
  catch(error){
    res.status(500).json({error: true, message: error.message})
  }
})

// serve static files from the uploads and assets directory
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

app.listen(8000, () => {
  console.log("Server running on port 8000");
});

module.exports = app;
